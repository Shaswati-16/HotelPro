const Room = require("../models/roomModel");
const handleError = require("../utils/handleError");

// GET /api/rooms
const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ roomNumber: 1 });
    return res.status(200).json(rooms);
  } catch (error) {
    return handleError(res, error);
  }
};

// POST /api/rooms (admin only)
const createRoom = async (req, res) => {
  try {
    const { roomNumber, capacity, rent, type, description, photos } = req.body;

    if (roomNumber == null || capacity == null || rent == null || !type || !description) {
      return res.status(400).json({
        msg: "roomNumber, capacity, rent, type and description are required",
      });
    }

    const room = await Room.create({
      roomNumber: Number(roomNumber),
      capacity: Number(capacity),
      rent: Number(rent),
      type,
      description,
      photos: Array.isArray(photos) ? photos : [],
    });

    return res.status(201).json(room);
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = { getRooms, createRoom };
