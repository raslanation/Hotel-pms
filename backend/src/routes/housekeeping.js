const express = require("express");
const { listHousekeeping, logCleaning, removeCleaning } = require("../controllers/housekeepingController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);
router.get("/", listHousekeeping);
router.post("/", logCleaning);
router.delete("/:id", removeCleaning);

module.exports = router;
