import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

const mockService = {
  getAllPatients: jest.fn(),
  findPatientByNationalId: jest.fn(),
  createNewPatient: jest.fn(),
  softDeletePatient: jest.fn(),
};

jest.unstable_mockModule('../services/patients.service.js', () => mockService);

const patientsRouter = await import('../routes/patients.routes.js');

describe('Patients API authorization integration', () => {
  let app;
  let currentRole;
  let currentNationalId;

  beforeEach(() => {
    currentRole = 'Patient';
    currentNationalId = 12345678;
    jest.clearAllMocks();

    app = express();
    app.use(express.json());
    app.use((req, res, next) => {
      req.session = {
        role: currentRole,
        nationalId: currentNationalId,
      };
      next();
    });
    app.use(patientsRouter.default);
  });

  it('allows a patient to resolve their own patient record', async () => {
    const patient = { id: 7, nationalId: 12345678, status: 'Enabled' };
    mockService.findPatientByNationalId.mockResolvedValue(patient);

    const response = await request(app)
      .post('/api/patients/nationalId')
      .send({ nationalId: 12345678 })
      .expect(200);

    expect(response.body).toEqual(patient);
    expect(mockService.findPatientByNationalId).toHaveBeenCalledWith(12345678);
  });

  it('rejects a patient trying to resolve another nationalId', async () => {
    await request(app)
      .post('/api/patients/nationalId')
      .send({ nationalId: 87654321 })
      .expect(403);

    expect(mockService.findPatientByNationalId).not.toHaveBeenCalled();
  });

  it.each(['Doctor', 'Admin'])('allows %s to resolve any patient record', async (role) => {
    currentRole = role;
    const patient = { id: 9, nationalId: 87654321, status: 'Enabled' };
    mockService.findPatientByNationalId.mockResolvedValue(patient);

    const response = await request(app)
      .post('/api/patients/nationalId')
      .send({ nationalId: 87654321 })
      .expect(200);

    expect(response.body).toEqual(patient);
  });
});
