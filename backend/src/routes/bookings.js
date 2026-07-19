const express = require("express");
const {
  listBookings, lookupBooking, createBooking, updateBookingStatus,
} = require("../controllers/bookingsController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/lookup", lookupBooking);
router.get("/", requireAuth, listBookings);
router.post("/", createBooking);
router.patch("/:id/status", requireAuth, updateBookingStatus);

module.exports = router;
