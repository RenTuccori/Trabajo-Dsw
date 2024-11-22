// middleware/authorizeRole.js
export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.session.rol; // Usuario tiene un único rol

    if (!userRole) {
      return res
        .status(401)
        .json({ message: "No autorizado. Token inválido o inexistente." });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: `Acceso denegado. Se requiere uno de los roles: ${allowedRoles.join(", ")}.`,
      });
    }

    next();
  };
};

// Exportar middleware para combinaciones de roles
export const Doctor = authorizeRole("D");
export const Admin = authorizeRole("A");
export const Paciente = authorizeRole("P");

// Ejemplo: Para rutas que aceptan tanto doctores como administradores
export const DoctorOrAdmin = authorizeRole("D", "A");
export const DoctorOrPaciente = authorizeRole("D", "P");
export const AdminOrPaciente = authorizeRole("A", "P");

// Ejemplo: Para rutas que aceptan todos los roles
export const AnyRole = authorizeRole("D", "A", "P");
