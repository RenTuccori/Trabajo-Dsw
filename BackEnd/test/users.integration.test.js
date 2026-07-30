import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// Mock the service layer
const mockService = {
  getAllUsers: jest.fn(),
  findUserByNationalId: jest.fn(),
  authenticatePatient: jest.fn(),
  createNewUser: jest.fn(),
  updateExistingUser: jest.fn(),
  deleteExistingUser: jest.fn(),
};

jest.unstable_mockModule('../services/users.service.js', () => mockService);

const usersRouter = await import('../routes/users.routes.js');

describe('Users API – Integration Tests', () => {
  let app;
  let currentRole = 'Patient';
  let currentNationalId = 12345678;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Mock JWT session middleware
    app.use((req, res, next) => {
      req.session = { role: currentRole, nationalId: currentNationalId };
      next();
    });

    app.use(usersRouter.default);
    jest.clearAllMocks();
    currentRole = 'Patient';
    currentNationalId = 12345678;
  });

  describe('GET /api/users/all', () => {
    it('should return list of users when Admin', async () => {
      currentRole = 'Admin';
      const users = [
        { nationalId: 12345678, firstName: 'Juan', lastName: 'Pérez' },
        { nationalId: 87654321, firstName: 'María', lastName: 'García' },
      ];
      mockService.getAllUsers.mockResolvedValue(users);

      const response = await request(app).get('/api/users/all').expect(200);

      expect(response.body).toEqual(users);
    });

    it('should return 403 when Patient tries to access GET /api/users/all', async () => {
      currentRole = 'Patient';
      await request(app).get('/api/users/all').expect(403);
    });

    it('should return 404 when no users and Admin', async () => {
      currentRole = 'Admin';
      mockService.getAllUsers.mockResolvedValue([]);

      await request(app).get('/api/users/all').expect(404);
    });
  });

  describe('POST /api/users/login', () => {
    it('should return JWT token for valid credentials', async () => {
      mockService.authenticatePatient.mockResolvedValue({ token: 'fake.jwt.token' });

      const response = await request(app)
        .post('/api/users/login')
        .send({ nationalId: 12345678, password: 'password' })
        .expect(200);

      expect(response.text).toContain('fake.jwt.token');
    });

    it('should return 404 for invalid credentials', async () => {
      mockService.authenticatePatient.mockResolvedValue(null);

      await request(app)
        .post('/api/users/login')
        .send({ nationalId: 99999999, password: 'wrong' })
        .expect(404);
    });

    it('should return 400 for missing required fields (validation)', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user and return 201', async () => {
      const newUser = { nationalId: 33333333, birthDate: '1995-05-05', firstName: 'Ana', lastName: 'López', password: 'abc', address: '123 Fake', healthInsuranceId: 1 };
      mockService.createNewUser.mockResolvedValue(newUser);

      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(201);

      expect(response.body.nationalId).toBe(33333333);
    });

    it('should return 400 when validation fails', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ nationalId: 123 }) // Too short DNI
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('POST /api/users/nationalId', () => {
    it('should return user by nationalId when nationalId matches session', async () => {
      const user = { nationalId: 12345678, firstName: 'Juan' };
      mockService.findUserByNationalId.mockResolvedValue(user);

      const response = await request(app)
        .post('/api/users/nationalId')
        .send({ nationalId: 12345678 })
        .expect(200);

      expect(response.body).toEqual(user);
    });

    it('should return 403 when Patient tries to fetch another user nationalId', async () => {
      currentNationalId = 99999999;
      await request(app)
        .post('/api/users/nationalId')
        .send({ nationalId: 12345678 })
        .expect(403);
    });

    it('should return 400 for invalid nationalId format when matching session', async () => {
      currentNationalId = 'abc';
      await request(app)
        .post('/api/users/nationalId')
        .send({ nationalId: 'abc' })
        .expect(400);
    });
  });
});

