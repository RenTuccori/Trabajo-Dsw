import { jest } from '@jest/globals';

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

const {
  getUsers,
  getUserByDni,
  getUserByDniFecha,
  createUser,
  updateUser,
  deleteUser,
} = await import('../controllers/usuarios.controllers.js');

describe('Usuarios Controller – Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, session: { rol: 'Patient' } };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      sendStatus: jest.fn(),
    };
    jest.clearAllMocks();
  });

  // ── getUsers ───────────────────────────────────────────
  describe('getUsers', () => {
    it('should return all users', async () => {
      const users = [{ dni: 11111111 }, { dni: 22222222 }];
      mockService.getAllUsers.mockResolvedValue(users);

      await getUsers(req, res);

      expect(mockService.getAllUsers).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(users);
    });

    it('should return 404 when no users', async () => {
      mockService.getAllUsers.mockResolvedValue([]);

      await getUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'No users loaded' });
    });

    it('should return 500 on error', async () => {
      mockService.getAllUsers.mockRejectedValue(new Error('DB error'));

      await getUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ── getUserByDni ───────────────────────────────────────
  describe('getUserByDni', () => {
    it('should return user when found', async () => {
      const user = { dni: 11111111, nombre: 'Test' };
      req.body.dni = 11111111;
      mockService.findUserByDni.mockResolvedValue(user);

      await getUserByDni(req, res);

      expect(mockService.findUserByDni).toHaveBeenCalledWith(11111111);
      expect(res.json).toHaveBeenCalledWith(user);
    });

    it('should return 404 when user not found', async () => {
      req.body.dni = 99999999;
      mockService.findUserByDni.mockResolvedValue(null);

      await getUserByDni(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  // ── getUserByDniFecha (auth) ───────────────────────────
  describe('getUserByDniFecha', () => {
    it('should return a JWT token for valid credentials', async () => {
      req.body = { dni: 11111111, fechaNacimiento: '1990-01-01' };
      mockService.authenticatePatient.mockResolvedValue({ token: 'fake.jwt.token' });

      await getUserByDniFecha(req, res);

      expect(mockService.authenticatePatient).toHaveBeenCalledWith(11111111, '1990-01-01');
      expect(res.json).toHaveBeenCalledWith('fake.jwt.token');
    });

    it('should return 404 for invalid credentials', async () => {
      req.body = { dni: 99999999, fechaNacimiento: '2000-01-01' };
      mockService.authenticatePatient.mockResolvedValue(null);

      await getUserByDniFecha(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  // ── createUser ─────────────────────────────────────────
  describe('createUser', () => {
    it('should create a user and return 201', async () => {
      const body = { dni: 33333333, nombre: 'Nuevo' };
      req.body = body;
      mockService.createNewUser.mockResolvedValue(body);

      await createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(body);
    });
  });

  // ── updateUser ─────────────────────────────────────────
  describe('updateUser', () => {
    it('should update user and return updated data', async () => {
      req.body = { dni: 11111111, nombre: 'Actualizado' };
      mockService.updateExistingUser.mockResolvedValue({ dni: 11111111, nombre: 'Actualizado' });

      await updateUser(req, res);

      expect(res.json).toHaveBeenCalled();
    });

    it('should return 404 when user not found', async () => {
      req.body = { dni: 99999999 };
      mockService.updateExistingUser.mockResolvedValue(null);

      await updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  // ── deleteUser ─────────────────────────────────────────
  describe('deleteUser', () => {
    it('should delete user and return 204', async () => {
      req.body = { dni: 11111111 };
      mockService.deleteExistingUser.mockResolvedValue(true);

      await deleteUser(req, res);

      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });

    it('should return 404 when user not found', async () => {
      req.body = { dni: 99999999 };
      mockService.deleteExistingUser.mockResolvedValue(false);

      await deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
