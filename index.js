//index
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const path = require('path');

const app = express();

// Passport configuration
require('./config/passport')(passport);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))  // Mensaje si la conexión es exitosa
  .catch(err => console.log('Error al conectar con MongoDB:', err)); // Manejo de errores de conexión

  
// EJS setup
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null; // Añadimos req.user para el rol
  next();
});

// Middlewares de autenticación y rol
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'Por favor inicia sesión para ver esta página');
  res.redirect('/auth/login');
}

function ensureAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'Administrador') {
    return next();
  }
  req.flash('error_msg', 'Acceso denegado');
  res.redirect('/');
}

// Routes
app.use('/', require('./routes/indexRouters'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/users', ensureAuthenticated, require('./routes/userRoutes'));

// Solo accesible por Administradores
app.use('/admin', ensureAuthenticated, ensureAdmin, require('./routes/adminroutes'));

// Port
const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
