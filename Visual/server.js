const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB (usa tu URL real)
mongoose.connect('mongodb+srv://rosalesvazquezsantiago46:1234@cluster0.egy6wky.mongodb.net/?retryWrites=true&w=majority')
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error de conexión:', err));

// Modelo con validaciones
const Alumno = mongoose.model('Alumno', {
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  edad: {
    type: Number,
    required: true,
    min: [5, 'La edad mínima es 5 años'],
    max: [20, 'La edad máxima es 20 años']
  },
  grado: {
    type: String,
    required: true,
    enum: ['1ro', '2do', '3ro', '4to', '5to', '6to']
  },
  grupo: {
    type: String,
    required: true,
    uppercase: true,
    match: /^[A-Z]$/
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
});

// CREAR alumno (POST)
app.post('/alumnos', async (req, res) => {
  try {
    const nuevoAlumno = new Alumno(req.body);
    await nuevoAlumno.save();
    res.status(201).json({ message: 'Alumno creado', data: nuevoAlumno });
  } catch (err) {
    res.status(400).json({ error: err.message, details: err.errors });
  }
});

// LISTAR alumnos (GET)
app.get('/alumnos', async (req, res) => {
  try {
    const alumnos = await Alumno.find();
    res.json(alumnos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// OBTENER alumno por ID (GET)
app.get('/alumnos/:id', async (req, res) => {
  try {
    const alumno = await Alumno.findById(req.params.id);
    if (!alumno) return res.status(404).json({ message: 'Alumno no encontrado' });
    res.json(alumno);
  } catch (err) {
    res.status(500).json({ message: 'Error interno' });
  }
});

// ACTUALIZAR alumno (PUT)
app.put('/alumnos/:id', async (req, res) => {
  try {
    await Alumno.findByIdAndUpdate(req.params.id, req.body, { runValidators: true });
    res.json({ message: 'Alumno actualizado' });
  } catch (err) {
    res.status(400).json({ error: err.message, details: err.errors });
  }
});

// ELIMINAR alumno (DELETE)
app.delete('/alumnos/:id', async (req, res) => {
  try {
    await Alumno.findByIdAndDelete(req.params.id);
    res.json({ message: 'Alumno eliminado' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
