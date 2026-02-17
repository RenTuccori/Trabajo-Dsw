import { jest } from '@jest/globals';

const mockService = {
  getDoctorsBySedEsp: jest.fn(),
  getAvailableDoctorsForSede: jest.fn(),
  getAllEnabledDoctors: jest.fn(),
  findDoctorByDni: jest.fn(),
  findDoctorById: jest.fn(),
  authenticateDoctor: jest.fn(),
  createNewDoctor: jest.fn(),
  softDeleteDoctor: jest.fn(),
  updateExistingDoctor: jest.fn(),
};

jest.unstable_mockModule('../services/doctores.service.js', () => mockService);

const {
  getDoctors,
  getAvailableDoctors,
  getDoctores,
  getDoctorByDni,
  getDoctorById,
  getDoctorByDniContra,
  createDoctor,
  deleteDoctor,
  updateDoctor,
} = await import('../controllers/doctores.controllers.js');

describe('Doctores Controller – Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      sendStatus: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('getDoctors', () => {
    it('should return doctors for sede and especialidad', async () => {
      req.body = { idSede: 1, idEspecialidad: 2 };
      const docs = [{ idDoctor: 1 }];
      mockService.getDoctorsBySedEsp.mockResolvedValue(docs);

      await getDoctors(req, res);

      expect(mockService.getDoctorsBySedEsp).toHaveBeenCalledWith(1, 2);
      expect(res.json).toHaveBeenCalledWith(docs);
    });

    it('should return 404 when no doctors found', async () => {
      req.body = { idSede: 1, idEspecialidad: 2 };
      mockService.getDoctorsBySedEsp.mockResolvedValue([]);

      await getDoctors(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('getDoctorByDniContra', () => {
    it('should return JWT for valid credentials', async () => {
      req.body = { dni: 12345678, contra: 'pass' };
      mockService.authenticateDoctor.mockResolvedValue({ token: 'jwt.token' });

      await getDoctorByDniContra(req, res);

      expect(res.json).toHaveBeenCalledWith('jwt.token');
    });

    it('should return 404 for invalid credentials', async () => {
      req.body = { dni: 99999999, contra: 'wrong' };
      mockService.authenticateDoctor.mockResolvedValue(null);

      await getDoctorByDniContra(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('createDoctor', () => {
    it('should create doctor and return 201', async () => {
      const body = { dni: 11111111, duracionTurno: 30, contra: 'pass' };
      req.body = body;
      mockService.createNewDoctor.mockResolvedValue({ idDoctor: 1, ...body });

      await createDoctor(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('deleteDoctor', () => {
    it('should soft-delete and return 204', async () => {
      req.params.idDoctor = 1;
      mockService.softDeleteDoctor.mockResolvedValue(true);

      await deleteDoctor(req, res);

      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });

    it('should return 404 when not found', async () => {
      req.params.idDoctor = 999;
      mockService.softDeleteDoctor.mockResolvedValue(false);

      await deleteDoctor(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('updateDoctor', () => {
    it('should update and return success message', async () => {
      req.params.idDoctor = 1;
      req.body = { duracionTurno: 45 };
      mockService.updateExistingDoctor.mockResolvedValue(true);

      await updateDoctor(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: 'Doctor actualizado' });
    });
  });
});
