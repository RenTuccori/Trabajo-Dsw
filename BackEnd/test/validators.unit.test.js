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
  validateUserNationalId,
  validateCreateUser,
  validateCreateLocation,
  validateLocationId,
  validateCreateSpecialty,
  validateDoctorLogin,
  validateCreateDoctor,
  validateCreateAppointment,
  validateAppointmentAction,
  validateAppointmentId,
  validateAdminLogin,
  validateSendEmail,
} = await import('../middleware/validators.js');

describe('Validation Middleware Tests', () => {

  describe('validateUserLogin', () => {
    it('should pass with valid data', async () => {
      const req = { body: { nationalId: 12345678, password: 'password123' } };
      const res = await runValidation(validateUserLogin, req);
      expect(res._status).toBeNull();
    });

    it('should fail with invalid nationalId', async () => {
      const req = { body: { nationalId: 123, password: 'password123' } };
      const res = await runValidation(validateUserLogin, req);
      expect(res._status).toBe(400);
      expect(res._json.errors).toBeDefined();
    });

    it('should fail with empty password', async () => {
      const req = { body: { nationalId: 12345678, password: '' } };
      const res = await runValidation(validateUserLogin, req);
      expect(res._status).toBe(400);
    });
  });

  describe('validateUserNationalId', () => {
    it('should pass with valid nationalId', async () => {
      const req = { body: { nationalId: 11111111 } };
      const res = await runValidation(validateUserNationalId, req);
      expect(res._status).toBeNull();
    });

    it('should fail when nationalId is missing', async () => {
      const req = { body: {} };
      const res = await runValidation(validateUserNationalId, req);
      expect(res._status).toBe(400);
    });
  });

  describe('validateCreateUser', () => {
    it('should pass with all required fields', async () => {
      const req = { body: { nationalId: 33333333, birthDate: '2000-06-15', firstName: 'Ana', lastName: 'López', password: 'abc', address: 'Calle Falsa', healthInsuranceId: 1 } };
      const res = await runValidation(validateCreateUser, req);
      expect(res._status).toBeNull();
    });

    it('should fail with empty firstName', async () => {
      const req = { body: { nationalId: 33333333, birthDate: '2000-06-15', firstName: '', lastName: 'López', password: 'abc', address: 'Calle Falsa', healthInsuranceId: 1 } };
      const res = await runValidation(validateCreateUser, req);
      expect(res._status).toBe(400);
    });
  });

  describe('validateCreateLocation', () => {
    it('should pass with name and address', async () => {
      const req = { body: { name: 'Sede Centro', address: 'Av. Siempreviva 123' } };
      const res = await runValidation(validateCreateLocation, req);
      expect(res._status).toBeNull();
    });

    it('should fail without name', async () => {
      const req = { body: { address: 'Av. Siempreviva 123' } };
      const res = await runValidation(validateCreateLocation, req);
      expect(res._status).toBe(400);
    });
  });

  describe('validateLocationId', () => {
    it('should pass with valid param', async () => {
      const req = { params: { id: '1' } };
      const res = await runValidation(validateLocationId, req);
      expect(res._status).toBeNull();
    });

    it('should fail with non-numeric param', async () => {
      const req = { params: { id: 'abc' } };
      const res = await runValidation(validateLocationId, req);
      expect(res._status).toBe(400);
    });
  });

  describe('validateDoctorLogin', () => {
    it('should pass with nationalId and password', async () => {
      const req = { body: { nationalId: 44444444, password: 'secreto' } };
      const res = await runValidation(validateDoctorLogin, req);
      expect(res._status).toBeNull();
    });

    it('should fail without password', async () => {
      const req = { body: { nationalId: 44444444 } };
      const res = await runValidation(validateDoctorLogin, req);
      expect(res._status).toBe(400);
    });
  });

  describe('validateCreateAppointment', () => {
    it('should pass with all required fields', async () => {
      const req = { body: { patientId: 1, dateTime: '2025-12-01 10:00', specialtyId: 1, doctorId: 1, locationId: 1 } };
      const res = await runValidation(validateCreateAppointment, req);
      expect(res._status).toBeNull();
    });

    it('should fail without patientId', async () => {
      const req = { body: { dateTime: '2025-12-01 10:00', specialtyId: 1, doctorId: 1, locationId: 1 } };
      const res = await runValidation(validateCreateAppointment, req);
      expect(res._status).toBe(400);
    });
  });

  describe('validateAppointmentAction', () => {
    it('should pass with valid id', async () => {
      const req = { body: { id: 5 } };
      const res = await runValidation(validateAppointmentAction, req);
      expect(res._status).toBeNull();
    });
  });

  describe('validateAppointmentId', () => {
    it('should pass with valid param', async () => {
      const req = { params: { id: '10' } };
      const res = await runValidation(validateAppointmentId, req);
      expect(res._status).toBeNull();
    });

    it('should fail with negative param', async () => {
      const req = { params: { id: '-1' } };
      const res = await runValidation(validateAppointmentId, req);
      expect(res._status).toBe(400);
    });
  });

  describe('validateAdminLogin', () => {
    it('should pass with username and password', async () => {
      const req = { body: { username: 'admin', password: 'pass123' } };
      const res = await runValidation(validateAdminLogin, req);
      expect(res._status).toBeNull();
    });

    it('should fail with empty username', async () => {
      const req = { body: { username: '', password: 'pass123' } };
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
