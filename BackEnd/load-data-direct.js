import sequelize from './db.js';
import bcrypt from 'bcrypt';

const loadDataDirect = async () => {
  try {
    console.log('🔧 Cargando datos de prueba con Sequelize...');
    
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida.');
    
    console.log('📋 Limpiando datos existentes...');
    // Deshabilitar foreign key checks temporalmente
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Limpiar tablas en orden correcto
    await sequelize.query('DELETE FROM turnos');
    await sequelize.query('DELETE FROM estudios'); 
    await sequelize.query('DELETE FROM horarios_disponibles');
    await sequelize.query('DELETE FROM sededoctoresp');
    await sequelize.query('DELETE FROM pacientes');
    await sequelize.query('DELETE FROM doctores');
    await sequelize.query('DELETE FROM usuarios');
    await sequelize.query('DELETE FROM especialidades');
    await sequelize.query('DELETE FROM sedes');
    await sequelize.query('DELETE FROM obrasociales');
    await sequelize.query('DELETE FROM fechas');
    
    // Re-habilitar foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    
    // 1. OBRAS SOCIALES
    console.log('📋 Cargando obras sociales...');
    await sequelize.query(`
      INSERT INTO obrasociales (idObraSocial, nombre, estado)
      VALUES 
        (1, 'OSDE', 'Habilitado'),
        (2, 'Swiss Medical', 'Habilitado'),
        (3, 'Medicus', 'Habilitado'),
        (4, 'Galeno', 'Habilitado'),
        (5, 'PAMI', 'Habilitado'),
        (6, 'IOMA', 'Habilitado'),
        (7, 'Unión Personal', 'Habilitado'),
        (8, 'Federada Salud', 'Habilitado'),
        (9, 'Particular', 'Habilitado')
    `);
    
    // 2. SEDES
    console.log('📋 Cargando sedes...');
    await sequelize.query(`
      INSERT INTO sedes (idSede, nombre, direccion, estado)
      VALUES 
        (1, 'Sede Central', 'Av. Córdoba 1234, CABA', 'Habilitado'),
        (2, 'Sede Norte', 'Av. Cabildo 5678, CABA', 'Habilitado'),
        (3, 'Sede Sur', 'Av. Rivadavia 9012, CABA', 'Habilitado'),
        (4, 'Sede Oeste', 'Av. Rivadavia 15000, Morón', 'Habilitado'),
        (5, 'Sede Este', 'Av. del Libertador 2500, Vicente López', 'Habilitado')
    `);
    
    // 3. ESPECIALIDADES
    console.log('📋 Cargando especialidades...');
    await sequelize.query(`
      INSERT INTO especialidades (idEspecialidad, nombre, estado)
      VALUES 
        (1, 'Cardiología', 'Habilitado'),
        (2, 'Neurología', 'Habilitado'),
        (3, 'Traumatología', 'Habilitado'),
        (4, 'Pediatría', 'Habilitado'),
        (5, 'Ginecología', 'Habilitado'),
        (6, 'Medicina General', 'Habilitado'),
        (7, 'Dermatología', 'Habilitado'),
        (8, 'Oftalmología', 'Habilitado'),
        (9, 'Otorrinolaringología', 'Habilitado'),
        (10, 'Psiquiatría', 'Habilitado')
    `);
    
    // 4. GENERAR FECHAS PARA TODO EL AÑO 2025
    console.log('📋 Generando fechas para el año 2025...');
    const fechas = [];
    const fechaInicio = new Date('2025-01-01');
    const fechaFin = new Date('2025-12-31');
    
    for (let fecha = new Date(fechaInicio); fecha <= fechaFin; fecha.setDate(fecha.getDate() + 1)) {
      const fechaStr = fecha.toISOString().split('T')[0];
      fechas.push(`('${fechaStr}')`);
    }
    
    // Insertar fechas en lotes para evitar queries muy largos
    const batchSize = 100;
    for (let i = 0; i < fechas.length; i += batchSize) {
      const batch = fechas.slice(i, i + batchSize);
      await sequelize.query(`INSERT INTO fechas (fechas) VALUES ${batch.join(', ')}`);
    }
    console.log(`   ✅ ${fechas.length} fechas generadas para 2025`);
    
    // 5. USUARIOS
    console.log('📋 Cargando usuarios...');
    await sequelize.query(`
      INSERT INTO usuarios (dni, fechaNacimiento, nombre, apellido, telefono, email, direccion, idObraSocial)
      VALUES 
        -- Doctores
        (12345678, '1980-05-15', 'Carlos', 'Rodríguez', '1134567890', 'carlos.rodriguez@hospital.com', 'Av. Santa Fe 1000', 1),
        (23456789, '1975-08-22', 'María', 'González', '1145678901', 'maria.gonzalez@hospital.com', 'Av. Callao 500', 2),
        (34567890, '1982-12-10', 'Juan', 'López', '1156789012', 'juan.lopez@hospital.com', 'Av. Corrientes 800', 3),
        (45678901, '1978-03-18', 'Ana', 'Martínez', '1167890123', 'ana.martinez@hospital.com', 'Av. 9 de Julio 200', 1),
        (56789012, '1985-11-25', 'Roberto', 'Silva', '1178901234', 'roberto.silva@hospital.com', 'Av. Las Heras 300', 2),
        (67890123, '1979-07-14', 'Patricia', 'Moreno', '1189012345', 'patricia.moreno@hospital.com', 'Av. Belgrano 750', 3),
        (78901234, '1983-09-30', 'Miguel', 'Herrera', '1190123456', 'miguel.herrera@hospital.com', 'Av. Pueyrredón 1200', 4),
        (89012345, '1981-02-28', 'Lucia', 'Vargas', '1101234567', 'lucia.vargas@hospital.com', 'Av. Santa Fe 2500', 5),
        (90123456, '1977-11-12', 'Ricardo', 'Mendoza', '1112345678', 'ricardo.mendoza@hospital.com', 'Av. Córdoba 3000', 1),
        (11223344, '1984-04-06', 'Florencia', 'Castro', '1123456789', 'florencia.castro@hospital.com', 'Av. Rivadavia 1500', 2),
        -- Pacientes
        (87654321, '1990-01-15', 'Laura', 'Fernández', '1198765432', 'laura.fernandez@email.com', 'Calle Falsa 123', 1),
        (76543210, '1985-06-20', 'Diego', 'Pérez', '1187654321', 'diego.perez@email.com', 'Av. Belgrano 456', 2),
        (65432109, '1992-09-12', 'Sofía', 'Torres', '1176543210', 'sofia.torres@email.com', 'San Martín 789', 3),
        (54321098, '1988-04-08', 'Martín', 'Ruiz', '1165432109', 'martin.ruiz@email.com', 'Mitre 321', 4),
        (43210987, '1995-12-03', 'Valentina', 'Morales', '1154321098', 'valentina.morales@email.com', 'Sarmiento 654', 5),
        (32109876, '1983-07-28', 'Fernando', 'Castro', '1143210987', 'fernando.castro@email.com', 'Alsina 987', 1),
        (21098765, '1991-10-17', 'Camila', 'Ramos', '1132109876', 'camila.ramos@email.com', 'Tucumán 159', 2),
        (10987654, '1987-02-14', 'Alejandro', 'Vega', '1121098765', 'alejandro.vega@email.com', 'Entre Ríos 753', 3),
        (98765432, '1993-05-25', 'Daniela', 'López', '1198765431', 'daniela.lopez@email.com', 'Av. Corrientes 2100', 6),
        (86754321, '1989-11-08', 'Sebastián', 'García', '1187654320', 'sebastian.garcia@email.com', 'San Juan 1500', 7),
        (75643210, '1994-03-16', 'Natalia', 'Martín', '1176543209', 'natalia.martin@email.com', 'Lavalle 800', 8),
        (64532109, '1986-08-30', 'Gonzalo', 'Sánchez', '1165432108', 'gonzalo.sanchez@email.com', 'Florida 1200', 9),
        (53421098, '1997-01-20', 'Mariana', 'Díaz', '1154321097', 'mariana.diaz@email.com', 'Paraguay 900', 1),
        (42310987, '1990-12-14', 'Tomás', 'Jiménez', '1143210986', 'tomas.jimenez@email.com', 'Uruguay 600', 2),
        (31209876, '1985-07-09', 'Agustina', 'Romero', '1132109875', 'agustina.romero@email.com', 'Maipú 1800', 3)
    `);
    
    // 6. DOCTORES con contraseñas hasheadas
    console.log('📋 Cargando doctores con contraseñas hasheadas...');
    const passwordHash = await bcrypt.hash('password123', 10);
    await sequelize.query(`
      INSERT INTO doctores (dni, duracionTurno, contra, estado)
      VALUES 
        (12345678, 30, '${passwordHash}', 'Habilitado'),
        (23456789, 45, '${passwordHash}', 'Habilitado'),
        (34567890, 30, '${passwordHash}', 'Habilitado'),
        (45678901, 60, '${passwordHash}', 'Habilitado'),
        (56789012, 30, '${passwordHash}', 'Habilitado'),
        (67890123, 30, '${passwordHash}', 'Habilitado'),
        (78901234, 45, '${passwordHash}', 'Habilitado'),
        (89012345, 30, '${passwordHash}', 'Habilitado'),
        (90123456, 30, '${passwordHash}', 'Habilitado'),
        (11223344, 45, '${passwordHash}', 'Habilitado')
    `);
    
    // 7. PACIENTES
    console.log('📋 Cargando pacientes...');
    await sequelize.query(`
      INSERT INTO pacientes (dni, estado)
      VALUES 
        (87654321, 'Habilitado'),
        (76543210, 'Habilitado'),
        (65432109, 'Habilitado'),
        (54321098, 'Habilitado'),
        (43210987, 'Habilitado'),
        (32109876, 'Habilitado'),
        (21098765, 'Habilitado'),
        (10987654, 'Habilitado'),
        (98765432, 'Habilitado'),
        (86754321, 'Habilitado'),
        (75643210, 'Habilitado'),
        (64532109, 'Habilitado'),
        (53421098, 'Habilitado'),
        (42310987, 'Habilitado'),
        (31209876, 'Habilitado')
    `);
    
    // 8. OBTENER IDS PARA RELACIONES
    console.log('📋 Obteniendo IDs para relaciones...');
    const [doctoresIds] = await sequelize.query('SELECT idDoctor, dni FROM doctores');
    const [pacientesIds] = await sequelize.query('SELECT idPaciente, dni FROM pacientes');
    
    console.log(`   - Doctores encontrados: ${doctoresIds.length}`);
    console.log(`   - Pacientes encontrados: ${pacientesIds.length}`);
    
    const getIdDoctor = (dni) => {
      const doctor = doctoresIds.find(d => d.dni === dni);
      if (!doctor) {
        console.log(`⚠️  Doctor con DNI ${dni} no encontrado`);
        return null;
      }
      return doctor.idDoctor;
    };
    
    const getIdPaciente = (dni) => {
      const paciente = pacientesIds.find(p => p.dni === dni);
      if (!paciente) {
        console.log(`⚠️  Paciente con DNI ${dni} no encontrado`);
        return null;
      }
      return paciente.idPaciente;
    };
    
    // 9. RELACIÓN SEDE-DOCTOR-ESPECIALIDAD
    console.log('📋 Cargando relaciones sede-doctor-especialidad...');
    await sequelize.query(`
      INSERT INTO sededoctoresp (idSede, idDoctor, idEspecialidad, estado)
      VALUES 
        -- Carlos Rodríguez (Cardiología)
        (1, ${getIdDoctor(12345678)}, 1, 'Habilitado'),
        (2, ${getIdDoctor(12345678)}, 1, 'Habilitado'),
        -- María González (Neurología)
        (1, ${getIdDoctor(23456789)}, 2, 'Habilitado'),
        (3, ${getIdDoctor(23456789)}, 2, 'Habilitado'),
        -- Juan López (Traumatología)
        (2, ${getIdDoctor(34567890)}, 3, 'Habilitado'),
        (3, ${getIdDoctor(34567890)}, 3, 'Habilitado'),
        -- Ana Martínez (Pediatría)
        (1, ${getIdDoctor(45678901)}, 4, 'Habilitado'),
        (2, ${getIdDoctor(45678901)}, 4, 'Habilitado'),
        -- Roberto Silva (Ginecología)
        (2, ${getIdDoctor(56789012)}, 5, 'Habilitado'),
        (3, ${getIdDoctor(56789012)}, 5, 'Habilitado'),
        -- Patricia Moreno (Medicina General)
        (1, ${getIdDoctor(67890123)}, 6, 'Habilitado'),
        (4, ${getIdDoctor(67890123)}, 6, 'Habilitado'),
        -- Miguel Herrera (Dermatología)
        (2, ${getIdDoctor(78901234)}, 7, 'Habilitado'),
        (5, ${getIdDoctor(78901234)}, 7, 'Habilitado'),
        -- Lucia Vargas (Oftalmología)
        (3, ${getIdDoctor(89012345)}, 8, 'Habilitado'),
        (4, ${getIdDoctor(89012345)}, 8, 'Habilitado'),
        -- Ricardo Mendoza (Otorrinolaringología)
        (1, ${getIdDoctor(90123456)}, 9, 'Habilitado'),
        (5, ${getIdDoctor(90123456)}, 9, 'Habilitado'),
        -- Florencia Castro (Psiquiatría)
        (3, ${getIdDoctor(11223344)}, 10, 'Habilitado'),
        (4, ${getIdDoctor(11223344)}, 10, 'Habilitado')
    `);
    
    // 10. HORARIOS DISPONIBLES (más completos)
    console.log('📋 Cargando horarios disponibles...');
    await sequelize.query(`
      INSERT INTO horarios_disponibles (idSede, idDoctor, idEspecialidad, dia, hora_inicio, hora_fin, estado)
      VALUES 
        -- Carlos Rodríguez - Cardiología
        (1, ${getIdDoctor(12345678)}, 1, 'Lunes', '08:00:00', '12:00:00', 'Habilitado'),
        (1, ${getIdDoctor(12345678)}, 1, 'Miércoles', '14:00:00', '18:00:00', 'Habilitado'),
        (2, ${getIdDoctor(12345678)}, 1, 'Martes', '09:00:00', '13:00:00', 'Habilitado'),
        (2, ${getIdDoctor(12345678)}, 1, 'Viernes', '08:00:00', '12:00:00', 'Habilitado'),
        
        -- María González - Neurología
        (1, ${getIdDoctor(23456789)}, 2, 'Lunes', '09:00:00', '12:00:00', 'Habilitado'),
        (1, ${getIdDoctor(23456789)}, 2, 'Jueves', '15:00:00', '18:00:00', 'Habilitado'),
        (3, ${getIdDoctor(23456789)}, 2, 'Viernes', '08:00:00', '11:00:00', 'Habilitado'),
        (3, ${getIdDoctor(23456789)}, 2, 'Martes', '14:00:00', '17:00:00', 'Habilitado'),
        
        -- Juan López - Traumatología
        (2, ${getIdDoctor(34567890)}, 3, 'Martes', '08:00:00', '12:00:00', 'Habilitado'),
        (2, ${getIdDoctor(34567890)}, 3, 'Jueves', '14:00:00', '17:00:00', 'Habilitado'),
        (3, ${getIdDoctor(34567890)}, 3, 'Miércoles', '09:00:00', '12:00:00', 'Habilitado'),
        (3, ${getIdDoctor(34567890)}, 3, 'Lunes', '15:00:00', '18:00:00', 'Habilitado'),
        
        -- Ana Martínez - Pediatría
        (1, ${getIdDoctor(45678901)}, 4, 'Lunes', '10:00:00', '14:00:00', 'Habilitado'),
        (1, ${getIdDoctor(45678901)}, 4, 'Miércoles', '08:00:00', '12:00:00', 'Habilitado'),
        (2, ${getIdDoctor(45678901)}, 4, 'Viernes', '08:00:00', '12:00:00', 'Habilitado'),
        (2, ${getIdDoctor(45678901)}, 4, 'Martes', '14:00:00', '18:00:00', 'Habilitado'),
        
        -- Roberto Silva - Ginecología
        (2, ${getIdDoctor(56789012)}, 5, 'Martes', '14:00:00', '18:00:00', 'Habilitado'),
        (2, ${getIdDoctor(56789012)}, 5, 'Jueves', '09:00:00', '13:00:00', 'Habilitado'),
        (3, ${getIdDoctor(56789012)}, 5, 'Lunes', '08:00:00', '12:00:00', 'Habilitado'),
        (3, ${getIdDoctor(56789012)}, 5, 'Viernes', '14:00:00', '17:00:00', 'Habilitado'),
        
        -- Patricia Moreno - Medicina General
        (1, ${getIdDoctor(67890123)}, 6, 'Lunes', '08:00:00', '12:00:00', 'Habilitado'),
        (1, ${getIdDoctor(67890123)}, 6, 'Miércoles', '14:00:00', '18:00:00', 'Habilitado'),
        (4, ${getIdDoctor(67890123)}, 6, 'Martes', '08:00:00', '12:00:00', 'Habilitado'),
        (4, ${getIdDoctor(67890123)}, 6, 'Jueves', '14:00:00', '18:00:00', 'Habilitado'),
        
        -- Miguel Herrera - Dermatología
        (2, ${getIdDoctor(78901234)}, 7, 'Lunes', '09:00:00', '12:00:00', 'Habilitado'),
        (2, ${getIdDoctor(78901234)}, 7, 'Miércoles', '15:00:00', '18:00:00', 'Habilitado'),
        (5, ${getIdDoctor(78901234)}, 7, 'Viernes', '08:00:00', '11:00:00', 'Habilitado'),
        (5, ${getIdDoctor(78901234)}, 7, 'Martes', '14:00:00', '17:00:00', 'Habilitado'),
        
        -- Lucia Vargas - Oftalmología
        (3, ${getIdDoctor(89012345)}, 8, 'Martes', '08:00:00', '12:00:00', 'Habilitado'),
        (3, ${getIdDoctor(89012345)}, 8, 'Jueves', '14:00:00', '17:00:00', 'Habilitado'),
        (4, ${getIdDoctor(89012345)}, 8, 'Lunes', '09:00:00', '12:00:00', 'Habilitado'),
        (4, ${getIdDoctor(89012345)}, 8, 'Viernes', '15:00:00', '18:00:00', 'Habilitado'),
        
        -- Ricardo Mendoza - Otorrinolaringología
        (1, ${getIdDoctor(90123456)}, 9, 'Miércoles', '08:00:00', '12:00:00', 'Habilitado'),
        (1, ${getIdDoctor(90123456)}, 9, 'Viernes', '14:00:00', '18:00:00', 'Habilitado'),
        (5, ${getIdDoctor(90123456)}, 9, 'Lunes', '08:00:00', '12:00:00', 'Habilitado'),
        (5, ${getIdDoctor(90123456)}, 9, 'Jueves', '14:00:00', '17:00:00', 'Habilitado'),
        
        -- Florencia Castro - Psiquiatría
        (3, ${getIdDoctor(11223344)}, 10, 'Martes', '09:00:00', '12:00:00', 'Habilitado'),
        (3, ${getIdDoctor(11223344)}, 10, 'Jueves', '15:00:00', '18:00:00', 'Habilitado'),
        (4, ${getIdDoctor(11223344)}, 10, 'Lunes', '08:00:00', '11:00:00', 'Habilitado'),
        (4, ${getIdDoctor(11223344)}, 10, 'Viernes', '14:00:00', '17:00:00', 'Habilitado')
    `);
    
    // 11. TURNOS DE EJEMPLO
    console.log('📋 Cargando turnos de ejemplo...');
    await sequelize.query(`
      INSERT INTO turnos (idPaciente, fechaYHora, fechaCancelacion, fechaConfirmacion, estado, idEspecialidad, idDoctor, idSede, mail)
      VALUES 
        -- Turnos futuros próximos (julio 2025)
        (${getIdPaciente(87654321)}, '2025-07-01 10:00:00', NULL, '2025-06-29 15:30:00', 'Confirmado', 1, ${getIdDoctor(12345678)}, 1, NULL),
        (${getIdPaciente(76543210)}, '2025-07-01 09:30:00', NULL, NULL, 'Pendiente', 2, ${getIdDoctor(23456789)}, 1, NULL),
        (${getIdPaciente(65432109)}, '2025-07-02 14:00:00', NULL, NULL, 'Pendiente', 3, ${getIdDoctor(34567890)}, 2, NULL),
        (${getIdPaciente(54321098)}, '2025-07-02 11:00:00', NULL, NULL, 'Pendiente', 4, ${getIdDoctor(45678901)}, 1, NULL),
        (${getIdPaciente(43210987)}, '2025-07-03 16:30:00', NULL, NULL, 'Pendiente', 5, ${getIdDoctor(56789012)}, 2, NULL),
        (${getIdPaciente(98765432)}, '2025-07-03 08:30:00', NULL, '2025-07-01 10:15:00', 'Confirmado', 6, ${getIdDoctor(67890123)}, 1, NULL),
        (${getIdPaciente(86754321)}, '2025-07-04 15:00:00', NULL, NULL, 'Pendiente', 7, ${getIdDoctor(78901234)}, 2, NULL),
        (${getIdPaciente(75643210)}, '2025-07-04 10:30:00', NULL, '2025-07-02 14:45:00', 'Confirmado', 8, ${getIdDoctor(89012345)}, 3, NULL),
        (${getIdPaciente(64532109)}, '2025-07-05 11:30:00', NULL, NULL, 'Pendiente', 9, ${getIdDoctor(90123456)}, 1, NULL),
        (${getIdPaciente(53421098)}, '2025-07-05 16:00:00', NULL, NULL, 'Pendiente', 10, ${getIdDoctor(11223344)}, 3, NULL),
        
        -- Más turnos futuros (segunda semana de julio)
        (${getIdPaciente(42310987)}, '2025-07-08 09:00:00', NULL, NULL, 'Pendiente', 1, ${getIdDoctor(12345678)}, 2, NULL),
        (${getIdPaciente(31209876)}, '2025-07-08 14:30:00', NULL, NULL, 'Pendiente', 2, ${getIdDoctor(23456789)}, 3, NULL),
        (${getIdPaciente(32109876)}, '2025-07-09 08:00:00', NULL, '2025-07-07 16:20:00', 'Confirmado', 3, ${getIdDoctor(34567890)}, 2, NULL),
        (${getIdPaciente(21098765)}, '2025-07-09 15:30:00', NULL, NULL, 'Pendiente', 4, ${getIdDoctor(45678901)}, 1, NULL),
        (${getIdPaciente(10987654)}, '2025-07-10 10:00:00', NULL, '2025-07-08 11:45:00', 'Confirmado', 5, ${getIdDoctor(56789012)}, 3, NULL),
        
        -- Turnos pasados (junio 2025 - para historial)
        (${getIdPaciente(87654321)}, '2025-06-20 11:00:00', NULL, '2025-06-18 10:00:00', 'Completado', 1, ${getIdDoctor(12345678)}, 2, NULL),
        (${getIdPaciente(76543210)}, '2025-06-22 16:30:00', NULL, '2025-06-20 14:15:00', 'Completado', 2, ${getIdDoctor(23456789)}, 3, NULL),
        (${getIdPaciente(65432109)}, '2025-06-15 08:30:00', NULL, '2025-06-12 09:45:00', 'Completado', 3, ${getIdDoctor(34567890)}, 2, NULL),
        (${getIdPaciente(54321098)}, '2025-06-10 14:00:00', NULL, '2025-06-08 16:20:00', 'Completado', 4, ${getIdDoctor(45678901)}, 1, NULL),
        (${getIdPaciente(43210987)}, '2025-06-05 09:00:00', NULL, '2025-06-03 11:30:00', 'Completado', 5, ${getIdDoctor(56789012)}, 3, NULL),
        (${getIdPaciente(98765432)}, '2025-06-18 10:30:00', NULL, '2025-06-16 15:45:00', 'Completado', 6, ${getIdDoctor(67890123)}, 4, NULL),
        (${getIdPaciente(86754321)}, '2025-06-12 16:00:00', NULL, '2025-06-10 12:30:00', 'Completado', 7, ${getIdDoctor(78901234)}, 2, NULL),
        (${getIdPaciente(75643210)}, '2025-06-25 11:30:00', NULL, '2025-06-23 14:15:00', 'Completado', 8, ${getIdDoctor(89012345)}, 4, NULL),
        (${getIdPaciente(64532109)}, '2025-06-08 09:45:00', NULL, '2025-06-06 16:50:00', 'Completado', 9, ${getIdDoctor(90123456)}, 5, NULL),
        (${getIdPaciente(53421098)}, '2025-06-14 15:15:00', NULL, '2025-06-12 10:25:00', 'Completado', 10, ${getIdDoctor(11223344)}, 3, NULL),
        
        -- Turnos cancelados (ejemplos)
        (${getIdPaciente(42310987)}, '2025-06-28 10:00:00', '2025-06-27 09:30:00', NULL, 'Cancelado', 1, ${getIdDoctor(12345678)}, 1, NULL),
        (${getIdPaciente(31209876)}, '2025-06-26 14:30:00', '2025-06-25 15:45:00', NULL, 'Cancelado', 2, ${getIdDoctor(23456789)}, 1, NULL),
        (${getIdPaciente(32109876)}, '2025-06-24 16:00:00', '2025-06-23 11:20:00', NULL, 'Cancelado', 6, ${getIdDoctor(67890123)}, 4, NULL)
    `);
    
    // 12. ESTUDIOS DE EJEMPLO
    console.log('📋 Cargando estudios de ejemplo...');
    await sequelize.query(`
      INSERT INTO estudios (idPaciente, idDoctor, fechaRealizacion, fechaCarga, nombreArchivo, rutaArchivo, descripcion)
      VALUES 
        -- Estudios de Laura Fernández (Cardiología)
        (${getIdPaciente(87654321)}, ${getIdDoctor(12345678)}, '2025-06-20', NOW(), 'electrocardiograma_laura_20250620.pdf', 'files/estudios/electrocardiograma_laura_20250620.pdf', 'Electrocardiograma de rutina - Resultados normales'),
        (${getIdPaciente(87654321)}, ${getIdDoctor(12345678)}, '2025-06-15', NOW(), 'ecocardiograma_laura_20250615.pdf', 'files/estudios/ecocardiograma_laura_20250615.pdf', 'Ecocardiograma Doppler - Función cardíaca normal'),
        (${getIdPaciente(87654321)}, ${getIdDoctor(12345678)}, '2025-06-10', NOW(), 'holter_laura_20250610.pdf', 'files/estudios/holter_laura_20250610.pdf', 'Holter 24hs - Ritmo sinusal normal'),
        
        -- Estudios de Diego Pérez (Neurología)
        (${getIdPaciente(76543210)}, ${getIdDoctor(23456789)}, '2025-06-18', NOW(), 'resonancia_cerebral_diego_20250618.pdf', 'files/estudios/resonancia_cerebral_diego_20250618.pdf', 'Resonancia magnética cerebral - Sin alteraciones'),
        (${getIdPaciente(76543210)}, ${getIdDoctor(23456789)}, '2025-06-10', NOW(), 'electroencefalograma_diego_20250610.pdf', 'files/estudios/electroencefalograma_diego_20250610.pdf', 'Electroencefalograma - Actividad normal'),
        (${getIdPaciente(76543210)}, ${getIdDoctor(23456789)}, '2025-06-05', NOW(), 'tomografia_cerebral_diego_20250605.pdf', 'files/estudios/tomografia_cerebral_diego_20250605.pdf', 'TAC cerebral - Estructuras normales'),
        
        -- Estudios de Sofía Torres (Traumatología)
        (${getIdPaciente(65432109)}, ${getIdDoctor(34567890)}, '2025-06-22', NOW(), 'radiografia_rodilla_sofia_20250622.jpg', 'files/estudios/radiografia_rodilla_sofia_20250622.jpg', 'Radiografía de rodilla izquierda - Lesión meniscal'),
        (${getIdPaciente(65432109)}, ${getIdDoctor(34567890)}, '2025-06-16', NOW(), 'resonancia_rodilla_sofia_20250616.pdf', 'files/estudios/resonancia_rodilla_sofia_20250616.pdf', 'Resonancia magnética de rodilla - Confirma lesión meniscal'),
        (${getIdPaciente(65432109)}, ${getIdDoctor(34567890)}, '2025-06-12', NOW(), 'radiografia_columna_sofia_20250612.jpg', 'files/estudios/radiografia_columna_sofia_20250612.jpg', 'Radiografía de columna lumbar - Sin alteraciones'),
        
        -- Estudios de Martín Ruiz (Pediatría)
        (${getIdPaciente(54321098)}, ${getIdDoctor(45678901)}, '2025-06-20', NOW(), 'analisis_sangre_martin_20250620.pdf', 'files/estudios/analisis_sangre_martin_20250620.pdf', 'Análisis de sangre completo - Valores normales'),
        (${getIdPaciente(54321098)}, ${getIdDoctor(45678901)}, '2025-06-12', NOW(), 'radiografia_torax_martin_20250612.jpg', 'files/estudios/radiografia_torax_martin_20250612.jpg', 'Radiografía de tórax - Sin alteraciones'),
        
        -- Estudios de Valentina Morales (Ginecología)
        (${getIdPaciente(43210987)}, ${getIdDoctor(56789012)}, '2025-06-25', NOW(), 'ecografia_pelvica_valentina_20250625.pdf', 'files/estudios/ecografia_pelvica_valentina_20250625.pdf', 'Ecografía pélvica - Estudio ginecológico normal'),
        (${getIdPaciente(43210987)}, ${getIdDoctor(56789012)}, '2025-06-14', NOW(), 'mamografia_valentina_20250614.pdf', 'files/estudios/mamografia_valentina_20250614.pdf', 'Mamografía de control - Sin hallazgos patológicos'),
        (${getIdPaciente(43210987)}, ${getIdDoctor(56789012)}, '2025-06-08', NOW(), 'papanicolaou_valentina_20250608.pdf', 'files/estudios/papanicolaou_valentina_20250608.pdf', 'Papanicolaou - Resultado normal'),
        
        -- Estudios de Daniela López (Medicina General)
        (${getIdPaciente(98765432)}, ${getIdDoctor(67890123)}, '2025-06-18', NOW(), 'analisis_completo_daniela_20250618.pdf', 'files/estudios/analisis_completo_daniela_20250618.pdf', 'Análisis clínico completo - Valores dentro de rango normal'),
        (${getIdPaciente(98765432)}, ${getIdDoctor(67890123)}, '2025-06-10', NOW(), 'electrocardiograma_daniela_20250610.pdf', 'files/estudios/electrocardiograma_daniela_20250610.pdf', 'ECG de rutina - Sin alteraciones'),
        
        -- Estudios de Sebastián García (Dermatología)
        (${getIdPaciente(86754321)}, ${getIdDoctor(78901234)}, '2025-06-12', NOW(), 'biopsia_piel_sebastian_20250612.pdf', 'files/estudios/biopsia_piel_sebastian_20250612.pdf', 'Biopsia de lesión cutánea - Benigna'),
        (${getIdPaciente(86754321)}, ${getIdDoctor(78901234)}, '2025-06-05', NOW(), 'dermatoscopia_sebastian_20250605.jpg', 'files/estudios/dermatoscopia_sebastian_20250605.jpg', 'Dermatoscopía - Nevus benigno'),
        
        -- Estudios de Natalia Martín (Oftalmología)
        (${getIdPaciente(75643210)}, ${getIdDoctor(89012345)}, '2025-06-25', NOW(), 'campimetria_natalia_20250625.pdf', 'files/estudios/campimetria_natalia_20250625.pdf', 'Campo visual - Normal'),
        (${getIdPaciente(75643210)}, ${getIdDoctor(89012345)}, '2025-06-18', NOW(), 'tomografia_ocular_natalia_20250618.pdf', 'files/estudios/tomografia_ocular_natalia_20250618.pdf', 'OCT retiniano - Sin alteraciones'),
        (${getIdPaciente(75643210)}, ${getIdDoctor(89012345)}, '2025-06-10', NOW(), 'fondo_ojo_natalia_20250610.jpg', 'files/estudios/fondo_ojo_natalia_20250610.jpg', 'Fondo de ojo - Retina normal'),
        
        -- Estudios de Gonzalo Sánchez (Otorrinolaringología)
        (${getIdPaciente(64532109)}, ${getIdDoctor(90123456)}, '2025-06-08', NOW(), 'audiometria_gonzalo_20250608.pdf', 'files/estudios/audiometria_gonzalo_20250608.pdf', 'Audiometría - Audición normal'),
        (${getIdPaciente(64532109)}, ${getIdDoctor(90123456)}, '2025-06-15', NOW(), 'timpanometria_gonzalo_20250615.pdf', 'files/estudios/timpanometria_gonzalo_20250615.pdf', 'Timpanometría - Función timpánica normal'),
        
        -- Estudios de Mariana Díaz (Psiquiatría)
        (${getIdPaciente(53421098)}, ${getIdDoctor(11223344)}, '2025-06-14', NOW(), 'evaluacion_psicologica_mariana_20250614.pdf', 'files/estudios/evaluacion_psicologica_mariana_20250614.pdf', 'Evaluación psicológica - Sin alteraciones significativas'),
        (${getIdPaciente(53421098)}, ${getIdDoctor(11223344)}, '2025-06-20', NOW(), 'test_cognitivo_mariana_20250620.pdf', 'files/estudios/test_cognitivo_mariana_20250620.pdf', 'Test cognitivo - Funciones preservadas'),
        
        -- Estudios adicionales
        (${getIdPaciente(42310987)}, ${getIdDoctor(12345678)}, '2025-06-22', NOW(), 'ergometria_tomas_20250622.pdf', 'files/estudios/ergometria_tomas_20250622.pdf', 'Ergometría - Capacidad funcional normal'),
        (${getIdPaciente(31209876)}, ${getIdDoctor(23456789)}, '2025-06-16', NOW(), 'doppler_carotideo_agustina_20250616.pdf', 'files/estudios/doppler_carotideo_agustina_20250616.pdf', 'Doppler carotídeo - Flujo normal'),
        (${getIdPaciente(32109876)}, ${getIdDoctor(34567890)}, '2025-06-19', NOW(), 'densitometria_fernando_20250619.pdf', 'files/estudios/densitometria_fernando_20250619.pdf', 'Densitometría ósea - Densidad normal para la edad')
    `);
    
    // Verificar datos cargados
    console.log('\n📊 Verificando datos cargados:');
    
    const [obras] = await sequelize.query('SELECT COUNT(*) as count FROM obrasociales');
    console.log(`   ✅ Obras sociales: ${obras[0].count}`);
    
    const [sedes] = await sequelize.query('SELECT COUNT(*) as count FROM sedes');
    console.log(`   ✅ Sedes: ${sedes[0].count}`);
    
    const [especialidades] = await sequelize.query('SELECT COUNT(*) as count FROM especialidades');
    console.log(`   ✅ Especialidades: ${especialidades[0].count}`);
    
    const [fechasCount] = await sequelize.query('SELECT COUNT(*) as count FROM fechas');
    console.log(`   ✅ Fechas: ${fechasCount[0].count}`);
    
    const [usuarios] = await sequelize.query('SELECT COUNT(*) as count FROM usuarios');
    console.log(`   ✅ Usuarios: ${usuarios[0].count}`);
    
    const [doctores] = await sequelize.query('SELECT COUNT(*) as count FROM doctores');
    console.log(`   ✅ Doctores: ${doctores[0].count}`);
    
    const [pacientes] = await sequelize.query('SELECT COUNT(*) as count FROM pacientes');
    console.log(`   ✅ Pacientes: ${pacientes[0].count}`);
    
    const [relaciones] = await sequelize.query('SELECT COUNT(*) as count FROM sededoctoresp');
    console.log(`   ✅ Relaciones sede-doctor-especialidad: ${relaciones[0].count}`);
    
    const [horarios] = await sequelize.query('SELECT COUNT(*) as count FROM horarios_disponibles');
    console.log(`   ✅ Horarios disponibles: ${horarios[0].count}`);
    
    const [turnos] = await sequelize.query('SELECT COUNT(*) as count FROM turnos');
    console.log(`   ✅ Turnos: ${turnos[0].count}`);
    
    const [estudios] = await sequelize.query('SELECT COUNT(*) as count FROM estudios');
    console.log(`   ✅ Estudios: ${estudios[0].count}`);
    
    console.log('\n🎉 ¡Base de datos completa cargada exitosamente!');
    console.log('💡 Credenciales para pruebas:');
    console.log('📋 Doctores por especialidad:');
    console.log('   🫀 Cardiología:');
    console.log('      - Dr. Carlos Rodríguez: DNI 12345678, password: password123');
    console.log('   🧠 Neurología:');
    console.log('      - Dra. María González: DNI 23456789, password: password123');
    console.log('   🦴 Traumatología:');
    console.log('      - Dr. Juan López: DNI 34567890, password: password123');
    console.log('   👶 Pediatría:');
    console.log('      - Dra. Ana Martínez: DNI 45678901, password: password123');
    console.log('   🤱 Ginecología:');
    console.log('      - Dr. Roberto Silva: DNI 56789012, password: password123');
    console.log('   🩺 Medicina General:');
    console.log('      - Dra. Patricia Moreno: DNI 67890123, password: password123');
    console.log('   🔬 Dermatología:');
    console.log('      - Dr. Miguel Herrera: DNI 78901234, password: password123');
    console.log('   👁️ Oftalmología:');
    console.log('      - Dra. Lucia Vargas: DNI 89012345, password: password123');
    console.log('   👂 Otorrinolaringología:');
    console.log('      - Dr. Ricardo Mendoza: DNI 90123456, password: password123');
    console.log('   🧠 Psiquiatría:');
    console.log('      - Dra. Florencia Castro: DNI 11223344, password: password123');
    console.log('📋 Pacientes (ejemplos):');
    console.log('   - Laura Fernández: DNI 87654321 (OSDE)');
    console.log('   - Diego Pérez: DNI 76543210 (Swiss Medical)');
    console.log('   - Sofía Torres: DNI 65432109 (Medicus)');
    console.log('   - Martín Ruiz: DNI 54321098 (Galeno)');
    console.log('   - Valentina Morales: DNI 43210987 (PAMI)');
    console.log('   - Daniela López: DNI 98765432 (IOMA)');
    console.log('   - Sebastián García: DNI 86754321 (Unión Personal)');
    console.log('   - Natalia Martín: DNI 75643210 (Federada Salud)');
    console.log('   - Gonzalo Sánchez: DNI 64532109 (Particular)');
    console.log('📅 Fechas disponibles: Todo el año 2025 (365 fechas)');
    console.log('🏥 Datos disponibles:');
    console.log('   - 9 obras sociales');
    console.log('   - 5 sedes médicas');
    console.log('   - 10 especialidades médicas');
    console.log('   - 10 doctores especialistas');
    console.log('   - 15 pacientes activos');
    console.log('   - Turnos pasados, futuros y cancelados');
    console.log('   - 27 estudios médicos de ejemplo');
    console.log('   - Horarios completos para todos los doctores');
    console.log('🔧 Sistema listo para pruebas completas de todas las funcionalidades');
    
  } catch (error) {
    console.error('❌ Error cargando datos:', error.message);
    console.error('💡 Stack:', error.stack);
  } finally {
    await sequelize.close();
  }
};

loadDataDirect();