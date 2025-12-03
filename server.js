const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Datos de ejemplo para la Ducati Multistrada
const motorcycleData = {
  id: 1,
  name: "Ducati Multistrada",
  model: "V4 S",
  year: 2024,
  engine: "1158cc Testastretta DVT",
  power: "170 HP",
  torque: "125 Nm",
  weight: "218 kg",
  price: 28000,
  features: [
    "Control de crucero adaptativo",
    "Frenos Brembo Stylema",
    "Suspensión Skyhook",
    "Pantalla TFT de 6.5 pulgadas"
  ]
};

// Simulación de base de datos de consultas
let inquiries = [];
let inquiryIdCounter = 1;

// ==================== ENDPOINTS ====================

// GET - Obtener información de la motocicleta
app.get('/api/motorcycle', (req, res) => {
  res.status(200).json({
    success: true,
    data: motorcycleData
  });
});

// GET - Obtener especificaciones técnicas
app.get('/api/motorcycle/specs', (req, res) => {
  const specs = {
    engine: motorcycleData.engine,
    power: motorcycleData.power,
    torque: motorcycleData.torque,
    weight: motorcycleData.weight
  };
  
  res.status(200).json({
    success: true,
    data: specs
  });
});

// POST - Enviar consulta o solicitud de información
app.post('/api/inquiries', (req, res) => {
  const { name, email, message } = req.body;
  
  // Validación
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: 'Todos los campos son requeridos'
    });
  }
  
  // Validación de email básica
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Email inválido'
    });
  }
  
  // Crear nueva consulta
  const newInquiry = {
    id: inquiryIdCounter++,
    name,
    email,
    message,
    createdAt: new Date().toISOString(),
    status: 'pending'
  };
  
  inquiries.push(newInquiry);
  
  res.status(201).json({
    success: true,
    data: newInquiry,
    message: 'Consulta recibida exitosamente'
  });
});

// GET - Obtener todas las consultas
app.get('/api/inquiries', (req, res) => {
  res.status(200).json({
    success: true,
    count: inquiries.length,
    data: inquiries
  });
});

// GET - Obtener consulta por ID
app.get('/api/inquiries/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const inquiry = inquiries.find(inq => inq.id === id);
  
  if (!inquiry) {
    return res.status(404).json({
      success: false,
      error: 'Consulta no encontrada'
    });
  }
  
  res.status(200).json({
    success: true,
    data: inquiry
  });
});

// PUT - Actualizar estado de consulta
app.put('/api/inquiries/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  
  const inquiryIndex = inquiries.findIndex(inq => inq.id === id);
  
  if (inquiryIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Consulta no encontrada'
    });
  }
  
  if (!status || !['pending', 'answered', 'closed'].includes(status)) {
    return res.status(400).json({
      success: false,
      error: 'Estado inválido. Debe ser: pending, answered o closed'
    });
  }
  
  inquiries[inquiryIndex].status = status;
  inquiries[inquiryIndex].updatedAt = new Date().toISOString();
  
  res.status(200).json({
    success: true,
    data: inquiries[inquiryIndex],
    message: 'Consulta actualizada exitosamente'
  });
});

// DELETE - Eliminar consulta
app.delete('/api/inquiries/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const inquiryIndex = inquiries.findIndex(inq => inq.id === id);
  
  if (inquiryIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Consulta no encontrada'
    });
  }
  
  inquiries.splice(inquiryIndex, 1);
  
  res.status(200).json({
    success: true,
    message: 'Consulta eliminada exitosamente'
  });
});

// Ruta de healthcheck
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada'
  });
});

// Exportar app para testing
module.exports = app;

// Solo iniciar servidor si no estamos en ambiente de testing
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
}