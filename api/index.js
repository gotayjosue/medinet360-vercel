const express = require('express');
const app = express();
const routes = require('../routes/routes');
const { connectToDatabase } = require('../models/database');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

// Rutas API
const authRoutes = require("../routes/authRoutes.js");
const patientsRoutes = require("../routes/patientsRoutes.js");
const appointmentsRoutes = require("../routes/appointmentsRoutes.js");
const clinicsRoutes = require("../routes/clinicsRoutes.js");

// Configuración
app.use(session({
  secret: process.env.SESSION_SECRET || 'MySecretKey',
  resave: false,
  saveUninitialized: false
}));

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(flash());

const allowedOrigins = [
  "http://localhost:5173",
  "https://medinet360.netlify.app"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

// Conexión a base de datos (una sola vez)
connectToDatabase()
  .then(() => console.log("✅ MongoDB connected"))
  .catch((e) => console.error("❌ MongoDB connection error:", e));

// Rutas
app.use("/", routes);
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientsRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/clinics", clinicsRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something broke!');
});

// ⚠️ En lugar de app.listen(), exportamos el servidor
module.exports = app;


