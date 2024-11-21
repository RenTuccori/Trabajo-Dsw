// middleware/authorizeRole.js
export const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    const userRole = req.session.rol; // Usuario tiene un único rol

    if (!userRole) {
      return res
        .status(401)
        .json({ message: "No autorizado. Token inválido o inexistente." });
    }
    if (userRole !== requiredRole) {
      return res.status(403).json({
        message: `Acceso denegado. Se requiere el rol: ${requiredRole}.`,
      });
    }

    next();
  };
};

// Exportar middleware para Doctor
export const Doctor = authorizeRole("D");
export const Admin = authorizeRole("A");
export const Paciente = authorizeRole("P");