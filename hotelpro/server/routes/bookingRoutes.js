const express = require("express");
const {
  createBooking,
  getMyBookings,
  getAllBookings,
} = require("../controllers/bookingController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);

router.post("/", createBooking);
router.get("/mine", getMyBookings);
router.get("/", requireAdmin, getAllBookings);

module.exports = router;
