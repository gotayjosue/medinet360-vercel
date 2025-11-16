const express = require("express");
const {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} = require("../controllers/appointmentsController.js");
const { requireAuth } = require("../middleware/requireAuth.js");
const validate = require("../middleware/appointmentValidate.js");
const router = express.Router();

router.get("/", requireAuth, getAppointments);
router.post("/", requireAuth, validate.appointmentValidationRules(), validate.check, createAppointment);
router.put("/:id", requireAuth, validate.appointmentValidationRules(), validate.check, updateAppointment);
router.delete("/:id", requireAuth, deleteAppointment);

module.exports = router;
