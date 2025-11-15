const express = require("express");
const {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} = require("../controllers/appointmentsController.js");
const { requireAuth } = require("../middleware/requireAuth.js");
const validate = require("../middleware/appointmenttValidate.js");
const router = express.Router();

router.use(requireAuth);

router.get("/", getAppointments);
router.post("/", validate.appointmentValidationRules(), validate.check, createAppointment);
router.put("/:id", validate.appointmentValidationRules(), validate.check, updateAppointment);
router.delete("/:id", deleteAppointment);

module.exports = router;
