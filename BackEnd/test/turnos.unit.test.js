import { jest } from '@jest/globals';

const mockService = {
  getAppointmentsByPatientDni: jest.fn(),
  getDoctorAppointmentHistory: jest.fn(),
  getDoctorAppointmentsToday: jest.fn(),
  getDoctorAppointmentsByDate: jest.fn(),
  confirmAppointment: jest.fn(),
  cancelAppointment: jest.fn(),
  createNewAppointment: jest.fn(),
  deleteExistingAppointment: jest.fn(),
};

jest.unstable_mockModule('../services/turnos.service.js', () => mockService);

const {
  getAppointmentByDni,
  getAppointmentsByDoctorHistory,
  getAppointmentsByDoctorToday,
  confirmAppointment,
  cancelAppointment,
  createAppointment,
  deleteAppointment,
} = await import('../controllers/turnos.controllers.js');

describe('Turnos Controller – Unit Tests', () => {
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

  describe('getAppointmentByDni', () => {
    it('should return turnos for a patient', async () => {
      req.body.dni = 11111111;
      const turnos = [{ idTurno: 1, estado: 'Pendiente' }];
      mockService.getAppointmentsByPatientDni.mockResolvedValue(turnos);

      await getAppointmentByDni(req, res);

      expect(res.json).toHaveBeenCalledWith(turnos);
    });

    it('should return 404 when no turnos', async () => {
      req.body.dni = 11111111;
      mockService.getAppointmentsByPatientDni.mockResolvedValue([]);

      await getAppointmentByDni(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('getAppointmentsByDoctorHistory', () => {
    it('should return 200 with empty data when no turnos', async () => {
      req.body.idDoctor = 1;
      mockService.getDoctorAppointmentHistory.mockResolvedValue([]);

      await getAppointmentsByDoctorHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'No appointment history', data: [] });
    });

    it('should return turnos wrapped in data', async () => {
      req.body.idDoctor = 1;
      const turnos = [{ sede: 'Sede1', estado: 'Confirmado' }];
      mockService.getDoctorAppointmentHistory.mockResolvedValue(turnos);

      await getAppointmentsByDoctorHistory(req, res);

      expect(res.json).toHaveBeenCalledWith({ data: turnos });
    });
  });

  describe('confirmAppointment', () => {
    it('should confirm turno', async () => {
      req.body.idTurno = 1;
      mockService.confirmAppointment.mockResolvedValue(true);

      await confirmAppointment(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: 'Appointment status updated to "Confirmed"' });
    });

    it('should return 404 when turno not found', async () => {
      req.body.idTurno = 999;
      mockService.confirmAppointment.mockResolvedValue(false);

      await confirmAppointment(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('cancelAppointment', () => {
    it('should cancel turno', async () => {
      req.body.idTurno = 1;
      mockService.cancelAppointment.mockResolvedValue(true);

      await cancelAppointment(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: 'Appointment status updated to "Cancelled"' });
    });
  });

  describe('createAppointment', () => {
    it('should create turno and return 201', async () => {
      const body = { idPaciente: 1, fechaYHora: '2025-01-01 10:00', estado: 'Pendiente', idEspecialidad: 1, idDoctor: 1, idSede: 1 };
      req.body = body;
      mockService.createNewAppointment.mockResolvedValue({ idTurno: 1, ...body });

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
