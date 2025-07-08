import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';

// Mock del pool de base de datos
const mockPool = {
  query: jest.fn(),
};

jest.unstable_mockModule('../db.js', () => ({
  pool: mockPool,
}));

// Importar después del mock
const { getUserByDniFecha, getUsers } = await import(
  '../controllers/usuarios.controllers.js'
);

describe('Usuarios Controllers Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      session: { rol: 'Patient' },
    };

    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return all users successfully', async () => {
      const mockUsers = [
        { dni: '12345678', nombre: 'Juan', apellido: 'Pérez' },
        { dni: '87654321', nombre: 'María', apellido: 'García' },
      ];

      mockPool.query.mockResolvedValue([mockUsers]);

      await getUsers(req, res);

      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM usuarios');
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should return 404 when no users found', async () => {
      mockPool.query.mockResolvedValue([[]]);

      await getUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No hay usuarios cargados',
      });
    });
  });

  describe('getUserByDniFecha', () => {
    it('should return JWT token for valid credentials', async () => {
      const mockUser = {
        dni: '12345678',
        nombre: 'Juan',
        apellido: 'Pérez',
        fechaNacimiento: '1990-01-01',
      };

      req.body = { dni: '12345678', fechaNacimiento: '1990-01-01' };
      mockPool.query.mockResolvedValue([[mockUser]]);

      await getUserByDniFecha(req, res);

      expect(mockPool.query).toHaveBeenCalledWith(
        'SELECT * FROM usuarios WHERE dni = ? and fechaNacimiento = ?',
        ['12345678', '1990-01-01']
      );

      // Verificar que se devolvió un JWT token
      expect(res.json).toHaveBeenCalled();
      const token = res.json.mock.calls[0][0];
      expect(typeof token).toBe('string');

      // Verificar que el token es válido y contiene los datos correctos
      const decoded = jwt.verify(token, 'CLAVE_SUPER_SEGURISIMA');
      expect(decoded.dni).toBe('12345678');
      expect(decoded.nombre).toBe('Juan');
      expect(decoded.apellido).toBe('Pérez');
      expect(decoded.rol).toBe('Patient');
    });

    it('should return 404 for invalid credentials', async () => {
      req.body = { dni: '99999999', fechaNacimiento: '1990-01-01' };
      mockPool.query.mockResolvedValue([[]]);

      await getUserByDniFecha(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Usuario no encontrado',
      });
    });

    it('should handle missing credentials', async () => {
      req.body = {}; // Sin dni ni fechaNacimiento
      mockPool.query.mockResolvedValue([[]]);

      await getUserByDniFecha(req, res);

      expect(mockPool.query).toHaveBeenCalledWith(
        'SELECT * FROM usuarios WHERE dni = ? and fechaNacimiento = ?',
        [undefined, undefined]
      );
    });
  });
});
