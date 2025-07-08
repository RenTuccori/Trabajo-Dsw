import { jest } from '@jest/globals';
import {
  authorizeRole,
  Admin,
  Patient,
  AdminOrPatient,
} from '../middleware/authorizeRole.js';

describe('Authorization Middleware Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      session: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    jest.clearAllMocks();
  });

  describe('authorizeRole', () => {
    it('should allow access when user has required role', () => {
      req.session.rol = 'Admin';
      const middleware = authorizeRole('Admin', 'Doctor');

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should deny access when user does not have required role', () => {
      req.session.rol = 'Patient';
      const middleware = authorizeRole('Admin', 'Doctor');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message:
          'Acceso denegado. Se requiere uno de los roles: Admin, Doctor.',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should deny access when user has no role', () => {
      req.session.rol = null;
      const middleware = authorizeRole('Admin');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No autorizado. Token inválido o inexistente.',
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('Predefined role middlewares', () => {
    it('Admin middleware should allow Admin role', () => {
      req.session.rol = 'Admin';

      Admin(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('Patient middleware should allow Patient role', () => {
      req.session.rol = 'Patient';

      Patient(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('AdminOrPatient middleware should allow both Admin and Patient roles', () => {
      // Test Admin
      req.session.rol = 'Admin';
      AdminOrPatient(req, res, next);
      expect(next).toHaveBeenCalled();

      // Reset mocks
      jest.clearAllMocks();

      // Test Patient
      req.session.rol = 'Patient';
      AdminOrPatient(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should deny access for unauthorized roles', () => {
      req.session.rol = 'Doctor';

      AdminOrPatient(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
