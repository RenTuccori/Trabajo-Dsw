import { jest } from '@jest/globals';

const mockService = {
  getDoctorsByLocationSpecialty: jest.fn(),
  getAllAvailableDoctors: jest.fn(),
  getAllDoctors: jest.fn(),
  findDoctorByNationalId: jest.fn(),
  findDoctorById: jest.fn(),
  authenticateDoctor: jest.fn(),
  createNewDoctor: jest.fn(),
  softDeleteDoctor: jest.fn(),
  updateExistingDoctor: jest.fn(),
};

jest.unstable_mockModule('../services/doctors.service.js', () => mockService);

const {
  getDoctors,
  getAvailableDoctors,
  getAllDoctors,
  getDoctorByNationalId,
  getDoctorById,
  getDoctorByCredentials,
  createDoctor,
  deleteDoctor,
  updateDoctor,
} = await import('../controllers/doctors.controllers.js');

describe('Doctors Controller – Unit Tests', () => {
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
    it('should return doctors for location and specialty', async () => {
      req.body = { locationId: 1, specialtyId: 2 };
      const docs = [{ idDoctor: 1 }];
      mockService.getDoctorsByLocationSpecialty.mockResolvedValue(docs);

      await getDoctors(req, res);

      expect(mockService.getDoctorsByLocationSpecialty).toHaveBeenCalledWith(1, 2);
      expect(res.json).toHaveBeenCalledWith(docs);
    });

    it('should return 404 when no doctors found', async () => {
      req.body = { locationId: 1, specialtyId: 2 };
      mockService.getDoctorsByLocationSpecialty.mockResolvedValue([]);

      await getDoctors(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('getDoctorByCredentials', () => {
    it('should return JWT for valid credentials', async () => {
      req.body = { nationalId: 12345678, password: 'pass' };
      mockService.authenticateDoctor.mockResolvedValue({ token: 'jwt.token' });

      await getDoctorByCredentials(req, res);

      expect(res.json).toHaveBeenCalledWith('jwt.token');
    });

    it('should return 404 for invalid credentials', async () => {
      req.body = { nationalId: 99999999, password: 'wrong' };
      mockService.authenticateDoctor.mockResolvedValue(null);

      await getDoctorByCredentials(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('createDoctor', () => {
    it('should create doctor and return 201', async () => {
      const body = { nationalId: 11111111, appointmentDuration: 30, password: 'pass' };
      req.body = body;
      mockService.createNewDoctor.mockResolvedValue({ id: 1, ...body });

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

      expect(res.json).toHaveBeenCalledWith({ message: 'Doctor updated' });
    });
  });
});
