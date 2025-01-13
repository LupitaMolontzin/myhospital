// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now },
  profileImage: {
    type: String, // Almacena la ruta de la imagen
    default: 'https://via.placeholder.com/100', // Imagen predeterminada
  },
  role: {
    type: String,
    enum: ['Operativo', 'Administrador'], // Define los roles posibles
    default: 'Operativo', // Asigna "Operativo" como el rol predeterminado
  },
});

// Comprobación para evitar duplicados del modelo
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
