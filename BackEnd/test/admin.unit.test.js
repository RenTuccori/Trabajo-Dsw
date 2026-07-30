import { jest } from '@jest/globals';

const mockService = {
  authenticateAdmin: jest.fn(),
  createNewCombination: jest.fn(),
  softDeleteCombination: jest.fn(),
  getAllCombinations: jest.fn(),
  replaceSchedules: jest.fn(),
  createNewSchedule: jest.fn(),
  updateExistingSchedule: jest.fn(),
  getSchedulesByDoctor: jest.fn(),
};

jest.unstable_mockModule('../services/admin.service.js', () => mockService);

const { deleteCombination } = await import('../controllers/admin.controllers.js');

describe('Admin Controller – Unit Tests', () => {
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

  describe('deleteCombination', () => {
    it('should call softDeleteCombination with an object containing locationId, doctorId, specialtyId', async () => {
      req.body = { locationId: 1, doctorId: 2, specialtyId: 3 };
      mockService.softDeleteCombination.mockResolvedValue(true);

      await deleteCombination(req, res);

      expect(mockService.softDeleteCombination).toHaveBeenCalledWith({
        locationId: 1,
        doctorId: 2,
        specialtyId: 3,
      });
      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });

    it('should return 404 if combination is not found', async () => {
      req.body = { locationId: 1, doctorId: 2, specialtyId: 3 };
      mockService.softDeleteCombination.mockResolvedValue(false);

      await deleteCombination(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Combination not found' });
    });
  });
});
