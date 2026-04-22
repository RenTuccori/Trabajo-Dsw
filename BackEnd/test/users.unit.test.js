import { jest } from '@jest/globals';

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

const {
  getUsers,
  getUserByNationalId,
  getUserByNationalIdPassword,
  createUser,
  updateUser,
  deleteUser,
} = await import('../controllers/users.controllers.js');

describe('Users Controller – Unit Tests', () => {
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
      const users = [{ nationalId: 11111111 }, { nationalId: 22222222 }];
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

  // ── getUserByNationalId ───────────────────────────────────────
  describe('getUserByNationalId', () => {
    it('should return user when found', async () => {
      const user = { nationalId: 11111111, firstName: 'Test' };
      req.body.nationalId = 11111111;
      mockService.findUserByNationalId.mockResolvedValue(user);

      await getUserByNationalId(req, res);

      expect(mockService.findUserByNationalId).toHaveBeenCalledWith(11111111);
      expect(res.json).toHaveBeenCalledWith(user);
    });

    it('should return 404 when user not found', async () => {
      req.body.nationalId = 99999999;
      mockService.findUserByNationalId.mockResolvedValue(null);

      await getUserByNationalId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  // ── getUserByCredentials (auth) ───────────────────────────
  describe('getUserByCredentials', () => {
    it('should return a JWT token for valid credentials', async () => {
      req.body = { nationalId: 11111111, password: 'password' };
      mockService.authenticatePatient.mockResolvedValue({ token: 'fake.jwt.token' });

      await getUserByNationalIdPassword(req, res);

      expect(mockService.authenticatePatient).toHaveBeenCalledWith(11111111, 'password');
      expect(res.json).toHaveBeenCalledWith('fake.jwt.token');
    });

    it('should return 404 for invalid credentials', async () => {
      req.body = { nationalId: 99999999, password: 'wrong' };
      mockService.authenticatePatient.mockResolvedValue(null);

      await getUserByNationalIdPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  // ── createUser ─────────────────────────────────────────
  describe('createUser', () => {
    it('should create a user and return 201', async () => {
      const body = { nationalId: 33333333, firstName: 'Nuevo' };
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
      req.body = { nationalId: 11111111, firstName: 'Actualizado' };
      mockService.updateExistingUser.mockResolvedValue({ nationalId: 11111111, firstName: 'Actualizado' });

      await updateUser(req, res);

      expect(res.json).toHaveBeenCalled();
    });

    it('should return 404 when user not found', async () => {
      req.body = { nationalId: 99999999 };
      mockService.updateExistingUser.mockResolvedValue(null);

      await updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  // ── deleteUser ─────────────────────────────────────────
  describe('deleteUser', () => {
    it('should delete user and return 204', async () => {
      req.body = { nationalId: 11111111 };
      mockService.deleteExistingUser.mockResolvedValue(true);

      await deleteUser(req, res);

      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });

    it('should return 404 when user not found', async () => {
      req.body = { nationalId: 99999999 };
      mockService.deleteExistingUser.mockResolvedValue(false);

      await deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
