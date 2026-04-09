import { USER_TYPES } from '../constants/userTypes.js';

export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.session.role;

    if (!userRole) {
      return res
        .status(401)
        .json({ message: 'Unauthorized. Invalid or missing token.' });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: `Access denied. One of the following roles is required: ${allowedRoles.join(
          ', '
        )}.`,
      });
    }

    next();
  };
};

export const Doctor = authorizeRole(USER_TYPES.DOCTOR);
export const Admin = authorizeRole(USER_TYPES.ADMIN);
export const Patient = authorizeRole(USER_TYPES.PATIENT);

export const DoctorOrAdmin = authorizeRole(USER_TYPES.DOCTOR, USER_TYPES.ADMIN);
export const DoctorOrPatient = authorizeRole(USER_TYPES.DOCTOR, USER_TYPES.PATIENT);
export const AdminOrPatient = authorizeRole(USER_TYPES.ADMIN, USER_TYPES.PATIENT);

export const AnyRole = authorizeRole(USER_TYPES.DOCTOR, USER_TYPES.ADMIN, USER_TYPES.PATIENT);
