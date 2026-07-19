const express = require("express");

const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/rooms", require("./rooms"));
router.use("/bookings", require("./bookings"));
router.use("/closures", require("./closures"));
router.use("/housekeeping", require("./housekeeping"));
router.use("/stats", require("./stats"));

module.exports = router;
