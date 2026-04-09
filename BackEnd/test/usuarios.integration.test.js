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

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Mock JWT session middleware
    app.use((req, res, next) => {
      req.session = { role: 'Patient' };
      next();
    });

    app.use(usersRouter.default);
    jest.clearAllMocks();
  });

  describe('GET /api/users/all', () => {
    it('should return list of users', async () => {
      const users = [
        { nationalId: 12345678, firstName: 'Juan', lastName: 'Perez' },
        { nationalId: 87654321, firstName: 'Maria', lastName: 'Garcia' },
      ];
      mockService.getAllUsers.mockResolvedValue(users);

      const response = await request(app).get('/api/users/all').expect(200);

      expect(response.body).toEqual(users);
    });

    it('should return 404 when no users', async () => {
      mockService.getAllUsers.mockResolvedValue([]);

      await request(app).get('/api/users/all').expect(404);
    });
  });

  describe('POST /api/users/login', () => {
    it('should return JWT token for valid credentials', async () => {
      mockService.authenticatePatient.mockResolvedValue({ token: 'fake.jwt.token' });

      const response = await request(app)
        .post('/api/users/login')
        .send({ nationalId: 12345678, password: 'pass123' })
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
      const newUser = { nationalId: 33333333, password: 'pass123', birthDate: '1995-05-05', firstName: 'Ana', lastName: 'Lopez' };
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
        .send({ nationalId: 123 }) // Too short national ID
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('POST /api/users/nationalId', () => {
    it('should return user by national ID', async () => {
      const user = { nationalId: 12345678, firstName: 'Juan' };
      mockService.findUserByNationalId.mockResolvedValue(user);

      const response = await request(app)
        .post('/api/users/nationalId')
        .send({ nationalId: 12345678 })
        .expect(200);

      expect(response.body).toEqual(user);
    });

    it('should return 400 for invalid nationalId format', async () => {
      await request(app)
        .post('/api/users/nationalId')
        .send({ nationalId: 'abc' })
        .expect(400);
    });
  });
});
