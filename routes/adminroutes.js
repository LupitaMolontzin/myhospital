const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Ruta para la configuración de usuarios (solo Administradores)
router.get('/manage-users', async (req, res) => {
  try {
    const users = await User.find();
    res.render('manageUsers', { users });
  } catch (err) {
    req.flash('error_msg', 'Error al cargar la lista de usuarios');
    res.redirect('/');
  }
});

module.exports = router;
