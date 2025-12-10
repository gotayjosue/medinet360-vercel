const nodemailer = require("nodemailer");

// Configurar transporte de correo
// Asegúrate de tener estas variables en tu archivo .env
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail", // Ej: 'gmail', 'hotmail'
    auth: {
        user: process.env.EMAIL_USER, // Tu correo
        pass: process.env.EMAIL_PASS, // Tu contraseña de aplicación
    },
});

/**
 * Envía un correo de notificación de activación de cuenta.
 * @param {string} email - Correo del destinatario
 * @param {string} name - Nombre del usuario
 */
const sendAccountActivationEmail = async (email, name) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Cuenta Activada - MediLink",
            html: `
        <h1>¡Hola ${name}!</h1>
        <p>Tu cuenta de asistente ha sido aprobada por el doctor.</p>
        <p>Ya puedes iniciar sesión en la plataforma.</p>
        <br>
        <p>Saludos,</p>
        <p>El equipo de MediLink</p>
      `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Correo enviado: " + info.response);
    } catch (error) {
        console.error("Error enviando correo:", error);
        // No lanzamos error para no detener el proceso de aprobación si falla el correo
    }
};

module.exports = { sendAccountActivationEmail };
