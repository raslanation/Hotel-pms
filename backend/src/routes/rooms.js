const express = require("express");
const { listRooms, listAvailableRooms, updateRoom, createRoom } = require("../controllers/roomsController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", listRooms);
router.get("/available", listAvailableRooms);
router.patch("/:id", requireAuth, updateRoom);
router.post("/", requireAuth, createRoom);

module.exports = router;
