const express = require("express");
const {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} = require("../controllers/appointmentsController.js");
const { requireAuth } = require("../middleware/requireAuth.js");
const validate = require("../middleware/appointmentValidate.js");
const router = express.Router();

router.use(requireAuth);

router.get("/", getAppointments);
router.get("/:id", getAppointmentById);
router.post("/", validate.appointmentValidationRules(), validate.check, createAppointment);
router.put("/:id", validate.appointmentValidationRules(), validate.check, updateAppointment);
router.delete("/:id", deleteAppointment);

module.exports = router;
