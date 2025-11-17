const Appointment = require("../models/Appointment.js");

// 🔹 Obtener citas por clínica
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ clinicId: req.user.clinicId })
      .populate("patientId")
      .populate("createdBy");
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Crear cita
const createAppointment = async (req, res) => {
  try {
    const { patientId, date, hour, duration, status, description } = req.body;

    //La fecha de la cita no puede ser en el pasado
    const appointmentDate = new Date(date);
    if (appointmentDate < new Date()) {
      return res.status(400).json({ error: "La fecha de la cita no puede ser en el pasado" });
    }

    const appointment = await Appointment.create({
      patientId,
      createdBy: req.user.userId,
      date,
      hour,
      duration,
      status,
      description,
      clinicId: req.user.clinicId,
    });
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Actualizar cita
const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, clinicId: req.user.clinicId },
      req.body,
      { new: true }
    );
    if (!appointment)
      return res.status(404).json({ error: "Cita no encontrada" });
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Eliminar cita
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndDelete({
      _id: req.params.id,
      clinicId: req.user.clinicId,
    });
    if (!appointment)
      return res.status(404).json({ error: "Cita no encontrada" });
    res.status(200).json({ message: "Cita eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment
}