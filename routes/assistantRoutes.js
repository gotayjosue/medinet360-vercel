const express = require("express");
const router = express.Router();
const assistantsController = require("../controllers/assistantsController");
const { requireAuth } = require("../middleware/requireAuth");

router.get("/pending", requireAuth, assistantsController.getPendingAssistants);
router.post("/approve", requireAuth, assistantsController.approveAssistant);

module.exports = router;
