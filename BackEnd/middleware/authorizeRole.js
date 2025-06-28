// middleware/authorizeRole.js
export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.session.rol; // Usuario tiene un único rol

    if (!userRole) {
      return res
        .status(401)
        .json({ message: 'No autorizado. Token inválido o inexistente.' });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: `Acceso denegado. Se requiere uno de los roles: ${allowedRoles.join(
          ', '
        )}.`,
      });
    }

    next();
  };
};

// Exportar middleware para combinaciones de roles
export const Doctor = authorizeRole('Doctor');
export const Admin = authorizeRole('Admin');
export const Patient = authorizeRole('Patient');

// Ejemplo: Para rutas que aceptan tanto doctores como administradores
export const DoctorOrAdmin = authorizeRole('Doctor', 'Admin');
export const DoctorOrPatient = authorizeRole('Doctor', 'Patient');
export const AdminOrPatient = authorizeRole('Admin', 'Patient');

// Ejemplo: Para rutas que aceptan todos los roles
export const AnyRole = authorizeRole('Doctor', 'Admin', 'Patient');
