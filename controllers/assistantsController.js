const User = require("../models/User");
const { sendAccountActivationEmail } = require("../utils/emailService");

// Obtener asistentes pendientes de aprobación para la clínica del doctor
const getPendingAssistants = async (req, res) => {
    try {
        // El middleware de autenticación debe haber puesto el usuario en req.user
        const doctorId = req.user.userId;

        // Buscar al doctor para obtener su clinicId
        // Nota: Podríamos usar req.user.clinicId si lo guardamos en el token, 
        // pero consultamos para asegurar datos frescos.
        const doctor = await User.findById(doctorId);

        if (!doctor || doctor.role !== "doctor") {
            return res.status(403).json({ error: "Acceso denegado. Solo doctores pueden ver esta información." });
        }

        const pendingAssistants = await User.find({
            clinicId: doctor.clinicId,
            role: "assistant",
            status: "pending",
        }).select("-password");

        res.status(200).json(pendingAssistants);
    } catch (error) {
        console.error("Error obteniendo asistentes pendientes:", error);
        res.status(500).json({ error: "Error del servidor" });
    }
};

// Aprobar un asistente
const approveAssistant = async (req, res) => {
    try {
        const { assistantId } = req.body; // O req.params.id si prefieres por URL
        const doctorId = req.user.userId;

        const doctor = await User.findById(doctorId);
        if (!doctor || doctor.role !== "doctor") {
            return res.status(403).json({ error: "Acceso denegado." });
        }

        const assistant = await User.findById(assistantId);
        if (!assistant) {
            return res.status(404).json({ error: "Asistente no encontrado." });
        }

        // Verificar que pertenezca a la misma clínica
        if (assistant.clinicId.toString() !== doctor.clinicId.toString()) {
            return res.status(403).json({ error: "No puedes aprobar asistentes de otra clínica." });
        }

        if (assistant.status === "active") {
            return res.status(400).json({ error: "El asistente ya está activo." });
        }

        // Actualizar estado
        assistant.status = "active";
        await assistant.save();

        // Enviar correo
        await sendAccountActivationEmail(assistant.email, assistant.name);

        res.status(200).json({ message: "Asistente aprobado y notificado correctamente.", assistant });
    } catch (error) {
        console.error("Error aprobando asistente:", error);
        res.status(500).json({ error: "Error del servidor" });
    }
};

module.exports = { getPendingAssistants, approveAssistant };
