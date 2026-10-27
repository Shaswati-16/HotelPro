const Booking = require("../models/bookingModel");
const Room = require("../models/roomModel");
const User = require("../models/userModel");
const handleError = require("../utils/handleError");

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { roomId, fromDate, toDate, phone, cardHolderName, cardLast4 } = req.body;

    if (!roomId || !fromDate || !toDate || !phone || !cardHolderName || !cardLast4) {
      return res.status(400).json({
        msg: "roomId, fromDate, toDate, phone, cardHolderName and cardLast4 are required",
      });
    }

    if (!/^\d{4}$/.test(String(cardLast4))) {
      return res.status(400).json({ msg: "cardLast4 must be exactly 4 digits" });
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
      return res.status(400).json({ msg: "Invalid date format" });
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    if (from < startOfToday) {
      return res.status(400).json({ msg: "Check-in date cannot be in the past" });
    }
    if (to <= from) {
      return res.status(400).json({ msg: "Check-out must be after check-in" });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ msg: "Room not found" });
    }

    // Two stays clash if each starts before the other ends
    const clash = await Booking.exists({
      room: room._id,
      status: "booked",
      fromDate: { $lt: to },
      toDate: { $gt: from },
    });
    if (clash) {
      return res.status(409).json({ msg: "This room is already booked for those dates" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const totalDays = Math.ceil((to - from) / ONE_DAY_MS);
    const totalAmount = totalDays * room.rent;

    const booking = await Booking.create({
      room: room._id,
      user: user._id,
      username: user.name,
      phone,
      fromDate: from,
      toDate: to,
      totalDays,
      totalAmount,
      payment: {
        cardHolderName,
        cardLast4: String(cardLast4),
      },
    });

    const populated = await booking.populate("room", "roomNumber type rent");
    return res.status(201).json(populated);
  } catch (error) {
    return handleError(res, error);
  }
};

// GET /api/bookings/mine
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("room", "roomNumber type rent")
      .sort({ createdAt: -1 });
    return res.status(200).json(bookings);
  } catch (error) {
    return handleError(res, error);
  }
};

// GET /api/bookings (admin only)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("room", "roomNumber type rent")
      .sort({ createdAt: -1 });
    return res.status(200).json(bookings);
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = { createBooking, getMyBookings, getAllBookings };
