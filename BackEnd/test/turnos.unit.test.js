import { jest } from '@jest/globals';

const mockService = {
  getTurnosByPacienteDni: jest.fn(),
  getTurnosHistoricoDoctor: jest.fn(),
  getTurnosDoctorHoy: jest.fn(),
  getTurnosDoctorByFecha: jest.fn(),
  confirmTurno: jest.fn(),
  cancelTurno: jest.fn(),
  createNewTurno: jest.fn(),
  deleteExistingTurno: jest.fn(),
};

jest.unstable_mockModule('../services/turnos.service.js', () => mockService);

const {
  getTurnoByDni,
  getTurnoByDoctorHistorico,
  getTurnoByDoctorHoy,
  confirmarTurno,
  cancelarTurno,
  createTurno,
  deleteTurno,
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

  describe('getTurnoByDni', () => {
    it('should return turnos for a patient', async () => {
      req.body.dni = 11111111;
      const turnos = [{ idTurno: 1, estado: 'Pendiente' }];
      mockService.getTurnosByPacienteDni.mockResolvedValue(turnos);

      await getTurnoByDni(req, res);

      expect(res.json).toHaveBeenCalledWith(turnos);
    });

    it('should return 404 when no turnos', async () => {
      req.body.dni = 11111111;
      mockService.getTurnosByPacienteDni.mockResolvedValue([]);

      await getTurnoByDni(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('getTurnoByDoctorHistorico', () => {
    it('should return 200 with empty data when no turnos', async () => {
      req.body.idDoctor = 1;
      mockService.getTurnosHistoricoDoctor.mockResolvedValue([]);

      await getTurnoByDoctorHistorico(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'No hay turnos históricos', data: [] });
    });

    it('should return turnos wrapped in data', async () => {
      req.body.idDoctor = 1;
      const turnos = [{ sede: 'Sede1', estado: 'Confirmado' }];
      mockService.getTurnosHistoricoDoctor.mockResolvedValue(turnos);

      await getTurnoByDoctorHistorico(req, res);

      expect(res.json).toHaveBeenCalledWith({ data: turnos });
    });
  });

  describe('confirmarTurno', () => {
    it('should confirm turno', async () => {
      req.body.idTurno = 1;
      mockService.confirmTurno.mockResolvedValue(true);

      await confirmarTurno(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: 'Estado del turno actualizado a "Confirmado"' });
    });

    it('should return 404 when turno not found', async () => {
      req.body.idTurno = 999;
      mockService.confirmTurno.mockResolvedValue(false);

      await confirmarTurno(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('cancelarTurno', () => {
    it('should cancel turno', async () => {
      req.body.idTurno = 1;
      mockService.cancelTurno.mockResolvedValue(true);

      await cancelarTurno(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: 'Estado del turno actualizado a "Cancelado"' });
    });
  });

  describe('createTurno', () => {
    it('should create turno and return 201', async () => {
      const body = { idPaciente: 1, fechaYHora: '2025-01-01 10:00', estado: 'Pendiente', idEspecialidad: 1, idDoctor: 1, idSede: 1 };
      req.body = body;
      mockService.createNewTurno.mockResolvedValue({ idTurno: 1, ...body });

      await createTurno(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('deleteTurno', () => {
    it('should delete turno and return 204', async () => {
      req.params.id = 1;
      mockService.deleteExistingTurno.mockResolvedValue(true);

      await deleteTurno(req, res);

      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });

    it('should return 404 when turno not found', async () => {
      req.params.id = 999;
      mockService.deleteExistingTurno.mockResolvedValue(false);

      await deleteTurno(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
