const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
    },
    totalDays: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    // Only the cardholder name and last 4 digits are stored.
    // Full card numbers and CVV must never be stored in your database.
    payment: {
      cardHolderName: { type: String, required: true },
      cardLast4: { type: String, required: true, match: /^\d{4}$/ },
    },
    status: {
      type: String,
      enum: ["booked", "cancelled"],
      default: "booked",
    },
  },
  { timestamps: true }
);

bookingSchema.index({ room: 1, status: 1, fromDate: 1, toDate: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
