const request = require('supertest');
const app = require('./server');

describe('API de Ducati Multistrada - Pruebas de Integración', () => {
  
  // ==================== PRUEBA 1: GET /api/motorcycle ====================
  describe('GET /api/motorcycle', () => {
    it('debería retornar información completa de la motocicleta', async () => {
      const response = await request(app)
        .get('/api/motorcycle')
        .expect(200)
        .expect('Content-Type', /json/);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data).toHaveProperty('name', 'Ducati Multistrada');
      expect(response.body.data).toHaveProperty('engine');
      expect(response.body.data).toHaveProperty('power');
      expect(response.body.data.features).toBeInstanceOf(Array);
      expect(response.body.data.features.length).toBeGreaterThan(0);
    });
  });

  // ==================== PRUEBA 2: GET /api/motorcycle/specs ====================
  describe('GET /api/motorcycle/specs', () => {
    it('debería retornar solo las especificaciones técnicas', async () => {
      const response = await request(app)
        .get('/api/motorcycle/specs')
        .expect(200)
        .expect('Content-Type', /json/);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data).toHaveProperty('engine');
      expect(response.body.data).toHaveProperty('power');
      expect(response.body.data).toHaveProperty('torque');
      expect(response.body.data).toHaveProperty('weight');
      
      // Verificar que NO incluya otros campos como precio o características
      expect(response.body.data).not.toHaveProperty('price');
      expect(response.body.data).not.toHaveProperty('features');
    });
  });

  // ==================== PRUEBA 3: POST /api/inquiries ====================
  describe('POST /api/inquiries', () => {
    it('debería crear una nueva consulta con datos válidos', async () => {
      const newInquiry = {
        name: 'Juan Pérez',
        email: 'juan.perez@example.com',
        message: '¿Cuál es el precio de la Ducati Multistrada V4 S?'
      };
      
      const response = await request(app)
        .post('/api/inquiries')
        .send(newInquiry)
        .expect(201)
        .expect('Content-Type', /json/);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(newInquiry.name);
      expect(response.body.data.email).toBe(newInquiry.email);
      expect(response.body.data.message).toBe(newInquiry.message);
      expect(response.body.data).toHaveProperty('createdAt');
      expect(response.body.data.status).toBe('pending');
    });

    it('debería retornar error 400 si faltan campos requeridos', async () => {
      const incompleteInquiry = {
        name: 'María García',
        email: 'maria@example.com'
        // Falta el campo 'message'
      };
      
      const response = await request(app)
        .post('/api/inquiries')
        .send(incompleteInquiry)
        .expect(400)
        .expect('Content-Type', /json/);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error).toContain('requeridos');
    });

    it('debería retornar error 400 con email inválido', async () => {
      const invalidEmailInquiry = {
        name: 'Carlos López',
        email: 'email-invalido',
        message: 'Consulta sobre disponibilidad'
      };
      
      const response = await request(app)
        .post('/api/inquiries')
        .send(invalidEmailInquiry)
        .expect(400)
        .expect('Content-Type', /json/);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Email inválido');
    });
  });

  // ==================== PRUEBA 4: GET /api/inquiries ====================
  describe('GET /api/inquiries', () => {
    beforeEach(async () => {
      // Crear algunas consultas de prueba
      await request(app)
        .post('/api/inquiries')
        .send({
          name: 'Test User 1',
          email: 'test1@example.com',
          message: 'Mensaje de prueba 1'
        });
      
      await request(app)
        .post('/api/inquiries')
        .send({
          name: 'Test User 2',
          email: 'test2@example.com',
          message: 'Mensaje de prueba 2'
        });
    });

    it('debería retornar todas las consultas', async () => {
      const response = await request(app)
        .get('/api/inquiries')
        .expect(200)
        .expect('Content-Type', /json/);
      
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBeDefined();
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.count).toBe(response.body.data.length);
      expect(response.body.data.length).toBeGreaterThanOrEqual(2);
    });
  });

  // ==================== PRUEBA 5: GET /api/inquiries/:id ====================
  describe('GET /api/inquiries/:id', () => {
    let createdInquiryId;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/inquiries')
        .send({
          name: 'Ana Martínez',
          email: 'ana@example.com',
          message: '¿Tienen financiamiento disponible?'
        });
      createdInquiryId = response.body.data.id;
    });

    it('debería retornar una consulta específica por ID', async () => {
      const response = await request(app)
        .get(`/api/inquiries/${createdInquiryId}`)
        .expect(200)
        .expect('Content-Type', /json/);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBe(createdInquiryId);
      expect(response.body.data.name).toBe('Ana Martínez');
    });

    it('debería retornar error 404 con ID no existente', async () => {
      const nonExistentId = 99999;
      
      const response = await request(app)
        .get(`/api/inquiries/${nonExistentId}`)
        .expect(404)
        .expect('Content-Type', /json/);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('no encontrada');
    });
  });

  // ==================== PRUEBA 6: PUT /api/inquiries/:id ====================
  describe('PUT /api/inquiries/:id', () => {
    let createdInquiryId;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/inquiries')
        .send({
          name: 'Pedro Sánchez',
          email: 'pedro@example.com',
          message: 'Consulta sobre mantenimiento'
        });
      createdInquiryId = response.body.data.id;
    });

    it('debería actualizar el estado de una consulta', async () => {
      const response = await request(app)
        .put(`/api/inquiries/${createdInquiryId}`)
        .send({ status: 'answered' })
        .expect(200)
        .expect('Content-Type', /json/);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('answered');
      expect(response.body.data).toHaveProperty('updatedAt');
    });

    it('debería retornar error 400 con estado inválido', async () => {
      const response = await request(app)
        .put(`/api/inquiries/${createdInquiryId}`)
        .send({ status: 'invalid_status' })
        .expect(400)
        .expect('Content-Type', /json/);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Estado inválido');
    });
  });

  // ==================== PRUEBA 7: DELETE /api/inquiries/:id ====================
  describe('DELETE /api/inquiries/:id', () => {
    let createdInquiryId;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/inquiries')
        .send({
          name: 'Luis Rodríguez',
          email: 'luis@example.com',
          message: 'Consulta temporal'
        });
      createdInquiryId = response.body.data.id;
    });

    it('debería eliminar una consulta existente', async () => {
      const response = await request(app)
        .delete(`/api/inquiries/${createdInquiryId}`)
        .expect(200)
        .expect('Content-Type', /json/);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('eliminada');
      
      // Verificar que ya no existe
      await request(app)
        .get(`/api/inquiries/${createdInquiryId}`)
        .expect(404);
    });

    it('debería retornar error 404 al intentar eliminar consulta inexistente', async () => {
      const nonExistentId = 99999;
      
      const response = await request(app)
        .delete(`/api/inquiries/${nonExistentId}`)
        .expect(404)
        .expect('Content-Type', /json/);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('no encontrada');
    });
  });

  // ==================== PRUEBA 8: Health Check ====================
  describe('GET /api/health', () => {
    it('debería retornar estado saludable de la API', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200)
        .expect('Content-Type', /json/);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('funcionando');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  // ==================== PRUEBA 9: Ruta no encontrada ====================
  describe('Rutas no existentes', () => {
    it('debería retornar error 404 para rutas no existentes', async () => {
      const response = await request(app)
        .get('/api/ruta-inexistente')
        .expect(404)
        .expect('Content-Type', /json/);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('no encontrada');
    });
  });
});