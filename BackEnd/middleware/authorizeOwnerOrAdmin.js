import { USER_TYPES } from '../constants/userTypes.js';

export const authorizeOwnerOrAdmin = (getNationalIdFromReq) => {
  return (req, res, next) => {
    const userRole = req.session?.role;
    const sessionNationalId = req.session?.nationalId;

    if (!userRole) {
      return res
        .status(401)
        .json({ message: 'Unauthorized. Invalid or missing token.' });
    }

    if (userRole === USER_TYPES.ADMIN) {
      return next();
    }

    const targetNationalId = getNationalIdFromReq(req);

    if (userRole === USER_TYPES.PATIENT && sessionNationalId && String(sessionNationalId) === String(targetNationalId)) {
      return next();
    }

    return res.status(403).json({
      message: 'Access denied. You can only access or modify your own information.',
    });
  };
};

export const authorizePatientOwnerOrStaff = (getNationalIdFromReq) => {
  return (req, res, next) => {
    const userRole = req.session?.role;
    const sessionNationalId = req.session?.nationalId;

    if (!userRole) {
      return res
        .status(401)
        .json({ message: 'Unauthorized. Invalid or missing token.' });
    }

    if (userRole === USER_TYPES.ADMIN || userRole === USER_TYPES.DOCTOR) {
      return next();
    }

    const targetNationalId = getNationalIdFromReq(req);

    if (
      userRole === USER_TYPES.PATIENT
      && sessionNationalId
      && String(sessionNationalId) === String(targetNationalId)
    ) {
      return next();
    }

    return res.status(403).json({
      message: 'Access denied. Patients can only access their own information.',
    });
  };
};
