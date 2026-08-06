import { jest } from '@jest/globals';

const transaction = { LOCK: { UPDATE: 'UPDATE' } };
const mockAppointment = {
  findOne: jest.fn(),
  create: jest.fn(),
};
const mockPatient = { findByPk: jest.fn() };
const mockDoctor = { findByPk: jest.fn() };
const mockSequelize = {
  transaction: jest.fn((callback) => callback(transaction)),
};

jest.unstable_mockModule('../models/index.js', () => ({
  Appointment: mockAppointment,
  Patient: mockPatient,
  Doctor: mockDoctor,
  User: {},
  Location: {},
  Specialty: {},
  sequelize: mockSequelize,
}));

const { createNewAppointment } = await import('../services/appointments.service.js');

describe('Appointments service slot integrity', () => {
  const appointmentData = {
    patientId: 4,
    doctorId: 2,
    specialtyId: 3,
    locationId: 1,
    dateTime: '2026-08-07 10:00:00',
    status: 'Confirmed',
    cancellationDate: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockPatient.findByPk.mockResolvedValue({ id: 4 });
    mockDoctor.findByPk.mockResolvedValue({ id: 2 });
    mockAppointment.findOne.mockResolvedValue(null);
    mockAppointment.create.mockImplementation((data) => Promise.resolve({ id: 10, ...data }));
  });

  it('stores the Argentina slot as UTC and forces a pending active appointment', async () => {
    const result = await createNewAppointment(appointmentData);

    expect(mockDoctor.findByPk).toHaveBeenCalledWith(2, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    expect(mockAppointment.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          doctorId: 2,
          dateTime: new Date('2026-08-07T13:00:00.000Z'),
          cancellationDate: null,
        }),
      })
    );
    expect(mockAppointment.create).toHaveBeenCalledWith(
      expect.objectContaining({
        dateTime: new Date('2026-08-07T13:00:00.000Z'),
        status: 'Pending',
        cancellationDate: null,
        confirmationDate: null,
      }),
      { transaction }
    );
    expect(result.id).toBe(10);
  });

  it('returns a conflict without inserting when the doctor is already occupied', async () => {
    mockAppointment.findOne.mockResolvedValue({ id: 99 });

    await expect(createNewAppointment(appointmentData)).rejects.toMatchObject({
      statusCode: 409,
      code: 'APPOINTMENT_SLOT_UNAVAILABLE',
    });
    expect(mockAppointment.create).not.toHaveBeenCalled();
  });

  it('maps the database unique constraint to the same conflict response', async () => {
    const uniqueError = new Error('Duplicate entry');
    uniqueError.name = 'SequelizeUniqueConstraintError';
    mockAppointment.create.mockRejectedValue(uniqueError);

    await expect(createNewAppointment(appointmentData)).rejects.toMatchObject({
      statusCode: 409,
      code: 'APPOINTMENT_SLOT_UNAVAILABLE',
    });
  });
});
