// middleware/authorizeRole.js
export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    console.log('🔐 BACKEND - Middleware authorizeRole ejecutándose');
    console.log('🎯 BACKEND - Roles permitidos:', allowedRoles);
    
    const userRole = req.session.rol; // Usuario tiene un único rol
    console.log('👤 BACKEND - Rol del usuario:', userRole);

    if (!userRole) {
      console.log('❌ BACKEND - Sin rol de usuario, acceso denegado');
      return res
        .status(401)
        .json({ message: 'Unauthorized. Invalid or missing token.' });
    }

    if (!allowedRoles.includes(userRole)) {
      console.log('🚫 BACKEND - Rol no autorizado para esta ruta');
      return res.status(403).json({
        message: `Access denied. Required roles: ${allowedRoles.join(
          ', '
        )}.`,
      });
    }

    console.log('✅ BACKEND - Autorización exitosa, continuando...');
    next();
  };
};

// Exportar middleware para combinaciones de roles
export const Doctor = authorizeRole('Doctor');
export const Admin = authorizeRole('Admin');
export const Patient = authorizeRole('Patient');

// Ejemplo: Para rutas que aceptan tanto doctors como administradores
export const DoctorOrAdmin = authorizeRole('Doctor', 'Admin');
export const DoctorOrPatient = authorizeRole('Doctor', 'Patient');
export const AdminOrPatient = authorizeRole('Admin', 'Patient');

// Ejemplo: Para rutas que aceptan todos los roles
export const AnyRole = authorizeRole('Doctor', 'Admin', 'Patient');
