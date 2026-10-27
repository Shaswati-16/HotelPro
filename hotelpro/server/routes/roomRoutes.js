const express = require("express");
const { getRooms, createRoom } = require("../controllers/roomController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/", requireAuth, getRooms);
router.post("/", requireAuth, requireAdmin, createRoom);

module.exports = router;
