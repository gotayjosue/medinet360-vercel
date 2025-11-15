const mongoose = require("mongoose");
const { type } = require("os");

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    dentistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // doctor o asistente
      required: true,
    },
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: true,
    },
    date: { type: String, required: true },
    hour: { type: String, require: true },
    duration: { type: Number, require: true },
    description: { type: String },
    status: {
      type: String,
      default: "scheduled",
      required: true,
    },
    duration: { type: String, required: true },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
