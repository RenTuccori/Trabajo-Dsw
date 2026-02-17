import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// Mock the service layer
const mockService = {
  getAllUsers: jest.fn(),
  findUserByDni: jest.fn(),
  authenticatePatient: jest.fn(),
  createNewUser: jest.fn(),
  updateExistingUser: jest.fn(),
  deleteExistingUser: jest.fn(),
};

jest.unstable_mockModule('../services/usuarios.service.js', () => mockService);

const usersRouter = await import('../routes/usuarios.routes.js');

describe('Usuarios API – Integration Tests', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Mock JWT session middleware
    app.use((req, res, next) => {
      req.session = { rol: 'Patient' };
      next();
    });

    app.use(usersRouter.default);
    jest.clearAllMocks();
  });

  describe('GET /api/userstodos', () => {
    it('should return list of users', async () => {
      const users = [
        { dni: 12345678, nombre: 'Juan', apellido: 'Pérez' },
        { dni: 87654321, nombre: 'María', apellido: 'García' },
      ];
      mockService.getAllUsers.mockResolvedValue(users);

      const response = await request(app).get('/api/userstodos').expect(200);

      expect(response.body).toEqual(users);
    });

    it('should return 404 when no users', async () => {
      mockService.getAllUsers.mockResolvedValue([]);

      await request(app).get('/api/userstodos').expect(404);
    });
  });

  describe('POST /api/usersdnifecha', () => {
    it('should return JWT token for valid credentials', async () => {
      mockService.authenticatePatient.mockResolvedValue({ token: 'fake.jwt.token' });

      const response = await request(app)
        .post('/api/usersdnifecha')
        .send({ dni: 12345678, fechaNacimiento: '1990-01-01' })
        .expect(200);

      expect(response.text).toContain('fake.jwt.token');
    });

    it('should return 404 for invalid credentials', async () => {
      mockService.authenticatePatient.mockResolvedValue(null);

      await request(app)
        .post('/api/usersdnifecha')
        .send({ dni: 99999999, fechaNacimiento: '2000-01-01' })
        .expect(404);
    });

    it('should return 400 for missing required fields (validation)', async () => {
      const response = await request(app)
        .post('/api/usersdnifecha')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user and return 201', async () => {
      const newUser = { dni: 33333333, fechaNacimiento: '1995-05-05', nombre: 'Ana', apellido: 'López' };
      mockService.createNewUser.mockResolvedValue(newUser);

      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(201);

      expect(response.body.dni).toBe(33333333);
    });

    it('should return 400 when validation fails', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ dni: 123 }) // Too short DNI
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('POST /api/usersdni', () => {
    it('should return user by DNI', async () => {
      const user = { dni: 12345678, nombre: 'Juan' };
      mockService.findUserByDni.mockResolvedValue(user);

      const response = await request(app)
        .post('/api/usersdni')
        .send({ dni: 12345678 })
        .expect(200);

      expect(response.body).toEqual(user);
    });

    it('should return 400 for invalid DNI format', async () => {
      await request(app)
        .post('/api/usersdni')
        .send({ dni: 'abc' })
        .expect(400);
    });
  });
});
