const express = require("express");
const { listClosures, createClosure, removeClosure } = require("../controllers/closuresController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);
router.get("/", listClosures);
router.post("/", createClosure);
router.delete("/:id", removeClosure);

module.exports = router;
