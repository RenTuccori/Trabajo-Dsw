import { jest } from '@jest/globals';

const mockService = {
  getAppointmentsByPatientNationalId: jest.fn(),
  getDoctorAppointmentHistory: jest.fn(),
  getDoctorAppointmentsToday: jest.fn(),
  getDoctorAppointmentsByDate: jest.fn(),
  confirmAppointment: jest.fn(),
  cancelAppointment: jest.fn(),
  createNewAppointment: jest.fn(),
  deleteExistingAppointment: jest.fn(),
};

jest.unstable_mockModule('../services/appointments.service.js', () => mockService);

const {
  getAppointmentByNationalId,
  getAppointmentsByDoctorHistory,
  getAppointmentsByDoctorToday,
  confirmAppointment,
  cancelAppointment,
  createAppointment,
  deleteAppointment,
} = await import('../controllers/appointments.controllers.js');

describe('Appointments Controller – Unit Tests', () => {
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

  describe('getAppointmentByNationalId', () => {
    it('should return turnos for a patient', async () => {
      req.body.nationalId = 11111111;
      const turnos = [{ id: 1, status: 'Pending' }];
      mockService.getAppointmentsByPatientNationalId.mockResolvedValue(turnos);

      await getAppointmentByNationalId(req, res);

      expect(res.json).toHaveBeenCalledWith(turnos);
    });

    it('should return 404 when no turnos', async () => {
      req.body.nationalId = 11111111;
      mockService.getAppointmentsByPatientNationalId.mockResolvedValue([]);

      await getAppointmentByNationalId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('getAppointmentsByDoctorHistory', () => {
    it('should return 200 with empty data when no turnos', async () => {
      req.body.doctorId = 1;
      mockService.getDoctorAppointmentHistory.mockResolvedValue([]);

      await getAppointmentsByDoctorHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'No appointment history', data: [] });
    });

    it('should return turnos wrapped in data', async () => {
      req.body.doctorId = 1;
      const turnos = [{ location: 'Sede1', status: 'Confirmed' }];
      mockService.getDoctorAppointmentHistory.mockResolvedValue(turnos);

      await getAppointmentsByDoctorHistory(req, res);

      expect(res.json).toHaveBeenCalledWith({ data: turnos });
    });
  });

  describe('confirmAppointment', () => {
    it('should confirm turno', async () => {
      req.body.id = 1;
      mockService.confirmAppointment.mockResolvedValue(true);

      await confirmAppointment(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: 'Appointment status updated to "Confirmed"' });
    });

    it('should return 404 when turno not found', async () => {
      req.body.id = 999;
      mockService.confirmAppointment.mockResolvedValue(false);

      await confirmAppointment(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('cancelAppointment', () => {
    it('should cancel turno', async () => {
      req.body.id = 1;
      mockService.cancelAppointment.mockResolvedValue(true);

      await cancelAppointment(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: 'Appointment status updated to "Cancelled"' });
    });
  });

  describe('createAppointment', () => {
    it('should create turno and return 201', async () => {
      const body = { patientId: 1, dateTime: '2025-01-01 10:00', status: 'Pending', specialtyId: 1, doctorId: 1, locationId: 1 };
      req.body = body;
      mockService.createNewAppointment.mockResolvedValue({ id: 1, ...body });

      await createAppointment(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('deleteAppointment', () => {
    it('should delete turno and return 204', async () => {
      req.params.id = 1;
      mockService.deleteExistingAppointment.mockResolvedValue(true);

      await deleteAppointment(req, res);

      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });

    it('should return 404 when turno not found', async () => {
      req.params.id = 999;
      mockService.deleteExistingAppointment.mockResolvedValue(false);

      await deleteAppointment(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
