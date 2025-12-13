const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer token"
    if (!token) return res.status(401).json({ error: "Token no proporcionado" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(401).json({ error: "Usuario no válido" });

    // 👈 LOG DE VERIFICACIÓN
    console.log(`[AUTH SUCCESS] User: ${user._id}, Role: ${user.role}`); 
    console.log(`[AUTH SUCCESS] Permissions keys: ${Object.keys(user.permissions).join(', ')}`);

    req.user = user; // contiene el objeto completo del usuario desde la BDD
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};

module.exports = { requireAuth }