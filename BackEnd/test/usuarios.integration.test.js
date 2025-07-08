import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// Mock del pool de base de datos
const mockPool = {
  query: jest.fn(),
};

jest.unstable_mockModule('../db.js', () => ({
  pool: mockPool,
}));

// Importar después del mock
const usersRouter = await import('../routes/usuarios.routes.js');

describe('Usuarios API Integration Tests', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Mock del middleware de autenticación
    app.use((req, res, next) => {
      req.session = { rol: 'Patient' };
      next();
    });

    app.use(usersRouter.default);

    // Limpiar mocks antes de cada test
    jest.clearAllMocks();
  });

  describe('GET /api/users/debug', () => {
    it('should return list of users', async () => {
      // Mock de la respuesta de la base de datos
      const mockUsers = [
        {
          dni: '12345678',
          nombre: 'Juan',
          apellido: 'Pérez',
          fechaNacimiento: '1990-01-01',
        },
        {
          dni: '87654321',
          nombre: 'María',
          apellido: 'García',
          fechaNacimiento: '1985-05-15',
        },
      ];

      pool.query.mockResolvedValue([mockUsers]);

      const response = await request(app).get('/api/users/debug').expect(200);

      expect(response.body).toEqual(mockUsers);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining(
          'SELECT dni, nombre, apellido, fechaNacimiento'
        ),
        expect.anything()
      );
    });

    it('should handle database errors', async () => {
      pool.query.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app).get('/api/users/debug').expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/usersdnifecha', () => {
    it('should return JWT token for valid user credentials', async () => {
      const mockUser = {
        dni: '12345678',
        nombre: 'Juan',
        apellido: 'Pérez',
        fechaNacimiento: '1990-01-01',
      };

      pool.query.mockResolvedValue([[mockUser]]);

      const response = await request(app)
        .post('/api/usersdnifecha')
        .send({ dni: '12345678', fechaNacimiento: '1990-01-01' })
        .expect(200);

      expect(typeof response.body).toBe('string'); // JWT token
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM usuarios WHERE dni = ? and fechaNacimiento = ?',
        ['12345678', '1990-01-01']
      );
    });

    it('should return 404 for user not found', async () => {
      pool.query.mockResolvedValue([[]]);

      const response = await request(app)
        .post('/api/usersdnifecha')
        .send({ dni: '99999999', fechaNacimiento: '1990-01-01' })
        .expect(404);

      expect(response.body.message).toBe('Usuario no encontrado');
    });
  });
});
