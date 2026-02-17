import { jest } from '@jest/globals';
import { validate } from '../middleware/validate.js';

/**
 * Helper: runs an array of express-validator middleware chains + validate
 * against fake req/res objects and returns the response.
 */
async function runValidation(validators, req) {
  const res = {
    _status: null,
    _json: null,
    status(code) { this._status = code; return this; },
    json(data) { this._json = data; return this; },
  };

  for (const middleware of validators) {
    await middleware(req, res, () => {});
  }
  await validate(req, res, () => {});

  return res;
}

// Import all validators
const {
  validateUserLogin,
  validateUserDni,
  validateCreateUser,
  validateCreateSede,
  validateSedeId,
  validateCreateEspecialidad,
  validateDoctorLogin,
  validateCreateDoctor,
  validateCreateTurno,
  validateTurnoAction,
  validateTurnoId,
  validateAdminLogin,
  validateSendEmail,
} = await import('../middleware/validators.js');

describe('Validation Middleware Tests', () => {

  describe('validateUserLogin', () => {
    it('should pass with valid data', async () => {
      const req = { body: { dni: 12345678, fechaNacimiento: '1990-01-15' } };
      const res = await runValidation(validateUserLogin, req);
      expect(res._status).toBeNull();
    });

    it('should fail with invalid DNI', async () => {
      const req = { body: { dni: 123, fechaNacimiento: '1990-01-15' } };
      const res = await runValidation(validateUserLogin, req);
      expect(res._status).toBe(400);
      expect(res._json.errors).toBeDefined();
    });

    it('should fail with invalid date', async () => {
      const req = { body: { dni: 12345678, fechaNacimiento: 'not-a-date' } };
      const res = await runValidation(validateUserLogin, req);
      expect(res._status).toBe(400);
    });
  });

  describe('validateUserDni', () => {
    it('should pass with valid DNI', async () => {
      const req = { body: { dni: 11111111 } };
      const res = await runValidation(validateUserDni, req);
      expect(res._status).toBeNull();
    });

    it('should fail when DNI is missing', async () => {
      const req = { body: {} };
      const res = await runValidation(validateUserDni, req);
      expect(res._status).toBe(400);
    });
  });

  describe('validateCreateUser', () => {
    it('should pass with all required fields', async () => {
      const req = { body: { dni: 33333333, fechaNacimiento: '2000-06-15', nombre: 'Ana', apellido: 'López' } };
      const res = await runValidation(validateCreateUser, req);
      expect(res._status).toBeNull();
    });

    it('should fail with empty nombre', async () => {
      const req = { body: { dni: 33333333, fechaNacimiento: '2000-06-15', nombre: '', apellido: 'López' } };
      const res = await runValidation(validateCreateUser, req);
      expect(res._status).toBe(400);
    });
  });

  describe('validateCreateSede', () => {
    it('should pass with nombre and direccion', async () => {
      const req = { body: { nombre: 'Sede Centro', direccion: 'Av. Siempreviva 123' } };
      const res = await runValidation(validateCreateSede, req);
      expect(res._status).toBeNull();
    });

    it('should fail without nombre', async () => {
      const req = { body: { direccion: 'Av. Siempreviva 123' } };
      const res = await runValidation(validateCreateSede, req);
      expect(res._status).toBe(400);
    });
  });

  describe('validateSedeId', () => {
    it('should pass with valid param', async () => {
      const req = { params: { idSede: '1' } };
      const res = await runValidation(validateSedeId, req);
      expect(res._status).toBeNull();
    });

    it('should fail with non-numeric param', async () => {
      const req = { params: { idSede: 'abc' } };
      const res = await runValidation(validateSedeId, req);
      expect(res._status).toBe(400);
    });
  });

  describe('validateDoctorLogin', () => {
    it('should pass with DNI and password', async () => {
      const req = { body: { dni: 44444444, contra: 'secreto' } };
      const res = await runValidation(validateDoctorLogin, req);
      expect(res._status).toBeNull();
    });

    it('should fail without password', async () => {
      const req = { body: { dni: 44444444 } };
      const res = await runValidation(validateDoctorLogin, req);
      expect(res._status).toBe(400);
    });
  });

  describe('validateCreateTurno', () => {
    it('should pass with all required fields', async () => {
      const req = { body: { idPaciente: 1, fechaYHora: '2025-12-01 10:00', idEspecialidad: 1, idDoctor: 1, idSede: 1 } };
      const res = await runValidation(validateCreateTurno, req);
      expect(res._status).toBeNull();
    });

    it('should fail without idPaciente', async () => {
      const req = { body: { fechaYHora: '2025-12-01 10:00', idEspecialidad: 1, idDoctor: 1, idSede: 1 } };
      const res = await runValidation(validateCreateTurno, req);
      expect(res._status).toBe(400);
    });
  });

  describe('validateTurnoAction', () => {
    it('should pass with valid idTurno', async () => {
      const req = { body: { idTurno: 5 } };
      const res = await runValidation(validateTurnoAction, req);
      expect(res._status).toBeNull();
    });
  });

  describe('validateTurnoId', () => {
    it('should pass with valid param', async () => {
      const req = { params: { id: '10' } };
      const res = await runValidation(validateTurnoId, req);
      expect(res._status).toBeNull();
    });

    it('should fail with negative param', async () => {
      const req = { params: { id: '-1' } };
      const res = await runValidation(validateTurnoId, req);
      expect(res._status).toBe(400);
    });
  });

  describe('validateAdminLogin', () => {
    it('should pass with usuario and contra', async () => {
      const req = { body: { usuario: 'admin', contra: 'pass123' } };
      const res = await runValidation(validateAdminLogin, req);
      expect(res._status).toBeNull();
    });

    it('should fail with empty usuario', async () => {
      const req = { body: { usuario: '', contra: 'pass123' } };
      const res = await runValidation(validateAdminLogin, req);
      expect(res._status).toBe(400);
    });
  });

  describe('validateSendEmail', () => {
    it('should pass with valid email data', async () => {
      const req = { body: { to: 'test@example.com', subject: 'Test', html: '<p>Hello</p>' } };
      const res = await runValidation(validateSendEmail, req);
      expect(res._status).toBeNull();
    });

    it('should fail with invalid email address', async () => {
      const req = { body: { to: 'not-email', subject: 'Test', html: '<p>Hi</p>' } };
      const res = await runValidation(validateSendEmail, req);
      expect(res._status).toBe(400);
    });
  });
});
