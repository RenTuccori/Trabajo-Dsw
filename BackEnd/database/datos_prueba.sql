-- Script de datos de prueba para el sistema médico
-- Ejecutar en orden para mantener las referencias de claves foráneas
-- 1. OBRAS SOCIALES (si no existen)
INSERT IGNORE INTO obrasociales (idObraSocial, nombre, estado)
VALUES (1, 'OSDE', 'Habilitado'),
  (2, 'Swiss Medical', 'Habilitado'),
  (3, 'Medicus', 'Habilitado'),
  (4, 'Galeno', 'Habilitado'),
  (5, 'PAMI', 'Habilitado');
-- 2. SEDES (si no existen)
INSERT IGNORE INTO sedes (idSede, nombre, direccion, estado)
VALUES (1, 'Sede Central', 'Av. Córdoba 1234, CABA', 'Habilitado'),
  (2, 'Sede Norte', 'Av. Cabildo 5678, CABA', 'Habilitado'),
  (3, 'Sede Sur', 'Av. Rivadavia 9012, CABA', 'Habilitado');
-- 2.1 FECHAS DISPONIBLES (para gestión de turnos)
-- Generando fechas para los próximos 6 meses
INSERT IGNORE INTO fechas (fechas)
VALUES 
  -- Febrero 2026
  ('2026-02-16'), ('2026-02-17'), ('2026-02-18'), ('2026-02-19'), ('2026-02-20'),
  ('2026-02-23'), ('2026-02-24'), ('2026-02-25'), ('2026-02-26'), ('2026-02-27'),
  -- Marzo 2026
  ('2026-03-02'), ('2026-03-03'), ('2026-03-04'), ('2026-03-05'), ('2026-03-06'),
  ('2026-03-09'), ('2026-03-10'), ('2026-03-11'), ('2026-03-12'), ('2026-03-13'),
  ('2026-03-16'), ('2026-03-17'), ('2026-03-18'), ('2026-03-19'), ('2026-03-20'),
  ('2026-03-23'), ('2026-03-24'), ('2026-03-25'), ('2026-03-26'), ('2026-03-27'),
  ('2026-03-30'), ('2026-03-31'),
  -- Abril 2026
  ('2026-04-01'), ('2026-04-02'), ('2026-04-03'), ('2026-04-06'), ('2026-04-07'),
  ('2026-04-08'), ('2026-04-09'), ('2026-04-10'), ('2026-04-13'), ('2026-04-14'),
  ('2026-04-15'), ('2026-04-16'), ('2026-04-17'), ('2026-04-20'), ('2026-04-21'),
  ('2026-04-22'), ('2026-04-23'), ('2026-04-24'), ('2026-04-27'), ('2026-04-28'),
  ('2026-04-29'), ('2026-04-30'),
  -- Mayo 2026
  ('2026-05-04'), ('2026-05-05'), ('2026-05-06'), ('2026-05-07'), ('2026-05-08'),
  ('2026-05-11'), ('2026-05-12'), ('2026-05-13'), ('2026-05-14'), ('2026-05-15'),
  ('2026-05-18'), ('2026-05-19'), ('2026-05-20'), ('2026-05-21'), ('2026-05-22'),
  ('2026-05-25'), ('2026-05-26'), ('2026-05-27'), ('2026-05-28'), ('2026-05-29'),
  -- Junio 2026
  ('2026-06-01'), ('2026-06-02'), ('2026-06-03'), ('2026-06-04'), ('2026-06-05'),
  ('2026-06-08'), ('2026-06-09'), ('2026-06-10'), ('2026-06-11'), ('2026-06-12'),
  ('2026-06-15'), ('2026-06-16'), ('2026-06-17'), ('2026-06-18'), ('2026-06-19'),
  ('2026-06-22'), ('2026-06-23'), ('2026-06-24'), ('2026-06-25'), ('2026-06-26'),
  ('2026-06-29'), ('2026-06-30'),
  -- Julio 2026
  ('2026-07-01'), ('2026-07-02'), ('2026-07-03'), ('2026-07-06'), ('2026-07-07'),
  ('2026-07-08'), ('2026-07-09'), ('2026-07-10'), ('2026-07-13'), ('2026-07-14'),
  ('2026-07-15'), ('2026-07-16'), ('2026-07-17'), ('2026-07-20'), ('2026-07-21'),
  ('2026-07-22'), ('2026-07-23'), ('2026-07-24'), ('2026-07-27'), ('2026-07-28'),
  ('2026-07-29'), ('2026-07-30'), ('2026-07-31'),
  -- Agosto 2026
  ('2026-08-03'), ('2026-08-04'), ('2026-08-05'), ('2026-08-06'), ('2026-08-07'),
  ('2026-08-10'), ('2026-08-11'), ('2026-08-12'), ('2026-08-13'), ('2026-08-14'),
  ('2026-08-17'), ('2026-08-18'), ('2026-08-19'), ('2026-08-20'), ('2026-08-21'),
  ('2026-08-24'), ('2026-08-25'), ('2026-08-26'), ('2026-08-27'), ('2026-08-28'),
  ('2026-08-31');
-- 3. ESPECIALIDADES (si no existen)
INSERT IGNORE INTO especialidades (idEspecialidad, nombre, estado)
VALUES (1, 'Cardiología', 'Habilitado'),
  (2, 'Neurología', 'Habilitado'),
  (3, 'Traumatología', 'Habilitado'),
  (4, 'Pediatría', 'Habilitado'),
  (5, 'Ginecología', 'Habilitado');
-- 4. USUARIOS DE PRUEBA
INSERT INTO usuarios (
    dni,
    fechaNacimiento,
    nombre,
    apellido,
    telefono,
    email,
    direccion,
    idObraSocial
  )
VALUES -- Doctores
  (
    '12345678',
    '1980-05-15',
    'Carlos',
    'Rodríguez',
    '1134567890',
    'carlos.rodriguez@hospital.com',
    'Av. Santa Fe 1000',
    1
  ),
  (
    '23456789',
    '1975-08-22',
    'María',
    'González',
    '1145678901',
    'maria.gonzalez@hospital.com',
    'Av. Callao 500',
    2
  ),
  (
    '34567890',
    '1982-12-10',
    'Juan',
    'López',
    '1156789012',
    'juan.lopez@hospital.com',
    'Av. Corrientes 800',
    3
  ),
  (
    '45678901',
    '1978-03-18',
    'Ana',
    'Martínez',
    '1167890123',
    'ana.martinez@hospital.com',
    'Av. 9 de Julio 200',
    1
  ),
  (
    '56789012',
    '1985-11-25',
    'Roberto',
    'Silva',
    '1178901234',
    'roberto.silva@hospital.com',
    'Av. Las Heras 300',
    2
  ),
  -- Pacientes
  (
    '87654321',
    '1990-01-15',
    'Laura',
    'Fernández',
    '1198765432',
    'laura.fernandez@email.com',
    'Calle Falsa 123',
    1
  ),
  (
    '76543210',
    '1985-06-20',
    'Diego',
    'Pérez',
    '1187654321',
    'diego.perez@email.com',
    'Av. Belgrano 456',
    2
  ),
  (
    '65432109',
    '1992-09-12',
    'Sofía',
    'Torres',
    '1176543210',
    'sofia.torres@email.com',
    'San Martín 789',
    3
  ),
  (
    '54321098',
    '1988-04-08',
    'Martín',
    'Ruiz',
    '1165432109',
    'martin.ruiz@email.com',
    'Mitre 321',
    4
  ),
  (
    '43210987',
    '1995-12-03',
    'Valentina',
    'Morales',
    '1154321098',
    'valentina.morales@email.com',
    'Sarmiento 654',
    5
  ),
  (
    '32109876',
    '1983-07-28',
    'Fernando',
    'Castro',
    '1143210987',
    'fernando.castro@email.com',
    'Alsina 987',
    1
  ),
  (
    '21098765',
    '1991-10-17',
    'Camila',
    'Ramos',
    '1132109876',
    'camila.ramos@email.com',
    'Tucumán 159',
    2
  ),
  (
    '10987654',
    '1987-02-14',
    'Alejandro',
    'Vega',
    '1121098765',
    'alejandro.vega@email.com',
    'Entre Ríos 753',
    3
  );
-- 5. DOCTORES
INSERT INTO doctores (dni, duracionTurno, contra, estado)
VALUES ('12345678', 30, 'password123', 'Habilitado'),
  -- Carlos Rodríguez
  ('23456789', 45, 'password123', 'Habilitado'),
  -- María González
  ('34567890', 30, 'password123', 'Habilitado'),
  -- Juan López
  ('45678901', 60, 'password123', 'Habilitado'),
  -- Ana Martínez
  ('56789012', 30, 'password123', 'Habilitado');
-- Roberto Silva
-- 6. PACIENTES
INSERT INTO pacientes (dni, estado)
VALUES ('87654321', 'Habilitado'),
  -- Laura Fernández
  ('76543210', 'Habilitado'),
  -- Diego Pérez
  ('65432109', 'Habilitado'),
  -- Sofía Torres
  ('54321098', 'Habilitado'),
  -- Martín Ruiz
  ('43210987', 'Habilitado'),
  -- Valentina Morales
  ('32109876', 'Habilitado'),
  -- Fernando Castro
  ('21098765', 'Habilitado'),
  -- Camila Ramos
  ('10987654', 'Habilitado');
-- Alejandro Vega
-- 7. RELACIÓN SEDE-DOCTOR-ESPECIALIDAD
INSERT INTO sededoctoresp (idSede, idDoctor, idEspecialidad, estado)
VALUES -- Carlos Rodríguez (idDoctor depende del AUTO_INCREMENT, usar SELECT)
  (
    1,
    (
      SELECT idDoctor
      FROM doctores
      WHERE dni = '12345678'
    ),
    1,
    'Habilitado'
  ),
  -- Cardiología en Sede Central
  (
    2,
    (
      SELECT idDoctor
      FROM doctores
      WHERE dni = '12345678'
    ),
    1,
    'Habilitado'
  ),
  -- Cardiología en Sede Norte
  -- María González
  (
    1,
    (
      SELECT idDoctor
      FROM doctores
      WHERE dni = '23456789'
    ),
    2,
    'Habilitado'
  ),
  -- Neurología en Sede Central
  (
    3,
    (
      SELECT idDoctor
      FROM doctores
      WHERE dni = '23456789'
    ),
    2,
    'Habilitado'
  ),
  -- Neurología en Sede Sur
  -- Juan López
  (
    2,
    (
      SELECT idDoctor
      FROM doctores
      WHERE dni = '34567890'
    ),
    3,
    'Habilitado'
  ),
  -- Traumatología en Sede Norte
  (
    3,
    (
      SELECT idDoctor
      FROM doctores
      WHERE dni = '34567890'
    ),
    3,
    'Habilitado'
  ),
  -- Traumatología en Sede Sur
  -- Ana Martínez
  (
    1,
    (
      SELECT idDoctor
      FROM doctores
      WHERE dni = '45678901'
    ),
    4,
    'Habilitado'
  ),
  -- Pediatría en Sede Central
  (
    2,
    (
      SELECT idDoctor
      FROM doctores
      WHERE dni = '45678901'
    ),
    4,
    'Habilitado'
  ),
  -- Pediatría en Sede Norte
  -- Roberto Silva
  (
    2,
    (
      SELECT idDoctor
      FROM doctores
      WHERE dni = '56789012'
    ),
    5,
    'Habilitado'
  ),
  -- Ginecología en Sede Norte
  (
    3,
    (
      SELECT idDoctor
      FROM doctores
      WHERE dni = '56789012'
    ),
    5,
    'Habilitado'
  );
-- Ginecología en Sede Sur
-- 8. HORARIOS DISPONIBLES (ejemplo para algunos doctores)
INSERT INTO horarios_disponibles (
    idSede,
    idDoctor,
    idEspecialidad,
    dia,
    hora_inicio,
    hora_fin,
    estado
  )
VALUES -- Carlos Rodríguez - Cardiología
  (
    1,
    (
      SELECT idDoctor
      FROM doctores
      WHERE dni = '12345678'
    ),
    1,
    'Lunes',
    '08:00:00',
    '12:00:00',
    'Habilitado'
  ),
  (
    1,
    (
      SELECT idDoctor
      FROM doctores
      WHERE dni = '12345678'
    ),
    1,
    'Miércoles',
    '14:00:00',
    '18:00:00',
    'Habilitado'
  ),
  (
    2,
    (
      SELECT idDoctor
      FROM doctores
      WHERE dni = '12345678'
    ),
    1,
    'Martes',
    '09:00:00',
    '13:00:00',
    'Habilitado'
  ),
  -- María González - Neurología
  (
    1,
    (
      SELECT idDoctor
      FROM doctores
      WHERE dni = '23456789'
    ),
    2,
    'Lunes',
    '09:00:00',
    '12:00:00',
    'Habilitado'
  ),
  (
    1,
    (
      SELECT idDoctor
      FROM doctores
      WHERE dni = '23456789'
    ),
    2,
    'Jueves',
    '15:00:00',
    '18:00:00',
    'Habilitado'
  ),
  (
    3,
    (
      SELECT idDoctor
      FROM doctores
      WHERE dni = '23456789'
    ),
    2,
    'Viernes',
    '08:00:00',
    '11:00:00',
    'Habilitado'
  ),
  -- Juan López - Traumatología
  (
    2,
    (
      SELECT idDoctor
      FROM doctores
      WHERE dni = '34567890'
    ),
    3,
    'Martes',
    '08:00:00',
    '12:00:00',
    'Habilitado'
  ),
  (
    2,
    (
      SELECT idDoctor
      FROM doctores
      WHERE dni = '34567890'
    ),
    3,
    'Jueves',
    '14:00:00',
    '17:00:00',
    'Habilitado'
  ),
  (
    3,
    (
      SELECT idDoctor
      FROM doctores
      WHERE dni = '34567890'
    ),
    3,
    'Miércoles',
    '09:00:00',
    '12:00:00',
    'Habilitado'
  );
-- 9. ALGUNOS TURNOS DE EJEMPLO
INSERT INTO turnos (
    idPaciente,
    fechaYHora,
    fechaCancelacion,
    fechaConfirmacion,
    estado,
    idEspecialidad,
    idDoctor,
    idSede,
    mail
  )
VALUES -- Turnos futuros
  (
    (
      SELECT idPaciente
      FROM pacientes
      WHERE dni = '87654321'
    ),
    '2025-06-30 10:00:00',
    NULL,
    '2025-06-25 15:30:00',
    'Confirmado',
    1,
    (
      SELECT idDoctor
      FROM doctores
      WHERE dni = '12345678'
    ),
    1,
    'laura.fernandez@email.com'
  ),
  (
    (
      SELECT idPaciente
      FROM pacientes
      WHERE dni = '76543210'
    ),
    '2025-07-02 09:30:00',
    NULL,
    NULL,
    'Pendiente',
    2,
    (
      SELECT idDoctor
      FROM doctores
      WHERE dni = '23456789'
    ),
    1,
    'diego.perez@email.com'
  ),
  (
    (
      SELECT idPaciente
      FROM pacientes
      WHERE dni = '65432109'
    ),
    '2025-07-05 14:00:00',
    NULL,
    NULL,
    'Pendiente',
    3,
    (
      SELECT idDoctor
      FROM doctores
      WHERE dni = '34567890'
    ),
    2,
    'sofia.torres@email.com'
  ),
  -- Turnos pasados (para historial)
  (
    (
      SELECT idPaciente
      FROM pacientes
      WHERE dni = '54321098'
    ),
    '2025-06-20 11:00:00',
    NULL,
    '2025-06-18 10:00:00',
    'Confirmado',
    4,
    (
      SELECT idDoctor
      FROM doctores
      WHERE dni = '45678901'
    ),
    1,
    'martin.ruiz@email.com'
  ),
  (
    (
      SELECT idPaciente
      FROM pacientes
      WHERE dni = '43210987'
    ),
    '2025-06-22 16:30:00',
    NULL,
    '2025-06-20 14:15:00',
    'Confirmado',
    1,
    (
      SELECT idDoctor
      FROM doctores
      WHERE dni = '12345678'
    ),
    2,
    'valentina.morales@email.com'
  ),
  (
    (
      SELECT idPaciente
      FROM pacientes
      WHERE dni = '32109876'
    ),
    '2025-06-15 08:30:00',
    NULL,
    '2025-06-12 09:45:00',
    'Confirmado',
    2,
    (
      SELECT idDoctor
      FROM doctores
      WHERE dni = '23456789'
    ),
    3,
    'fernando.castro@email.com'
  );
-- 10. ESTUDIOS DE EJEMPLO
INSERT INTO estudios (
    idPaciente,
    idDoctor,
    fechaRealizacion,
    fechaCarga,
    nombreArchivo,
    rutaArchivo,
    descripcion
  )
VALUES -- Estudios de Laura Fernández
  (
    (
      SELECT idPaciente
      FROM pacientes
      WHERE dni = '87654321'
    ),
    (
      SELECT idDoctor
      FROM doctores
      WHERE dni = '12345678'
    ),
    '2025-06-20',
    NOW(),
    'electrocardiograma_laura_20250620.pdf',
    './files/estudios/electrocardiograma_laura_20250620.pdf',
    'Electrocardiograma de rutina - Resultados normales'
  ),
  (
    (
      SELECT idPaciente
      FROM pacientes
      WHERE dni = '87654321'
    ),
    (
      SELECT idDoctor
      FROM doctores
      WHERE dni = '12345678'
    ),
    '2025-06-15',
    NOW(),
    'ecocardiograma_laura_20250615.pdf',
    './files/estudios/ecocardiograma_laura_20250615.pdf',
    'Ecocardiograma Doppler - Función cardíaca normal'
  ),
  -- Estudios de Diego Pérez
  (
    (
      SELECT idPaciente
      FROM pacientes
      WHERE dni = '76543210'
    ),
    (
      SELECT idDoctor
      FROM doctores
      WHERE dni = '23456789'
    ),
    '2025-06-18',
    NOW(),
    'resonancia_cerebral_diego_20250618.pdf',
    './files/estudios/resonancia_cerebral_diego_20250618.pdf',
    'Resonancia magnética cerebral - Sin alteraciones'
  ),
  (
    (
      SELECT idPaciente
      FROM pacientes
      WHERE dni = '76543210'
    ),
    (
      SELECT idDoctor
      FROM doctores
      WHERE dni = '23456789'
    ),
    '2025-06-10',
    NOW(),
    'electroencefalograma_diego_20250610.pdf',
    './files/estudios/electroencefalograma_diego_20250610.pdf',
    'EEG de rutina - Actividad eléctrica normal'
  ),
  -- Estudios de Sofía Torres
  (
    (
      SELECT idPaciente
      FROM pacientes
      WHERE dni = '65432109'
    ),
    (
      SELECT idDoctor
      FROM doctores
      WHERE dni = '34567890'
    ),
    '2025-06-22',
    NOW(),
    'radiografia_rodilla_sofia_20250622.jpg',
    './files/estudios/radiografia_rodilla_sofia_20250622.jpg',
    'Radiografía de rodilla izquierda - Lesión meniscal'
  ),
  (
    (
      SELECT idPaciente
      FROM pacientes
      WHERE dni = '65432109'
    ),
    (
      SELECT idDoctor
      FROM doctores
      WHERE dni = '34567890'
    ),
    '2025-06-05',
    NOW(),
    'tomografia_rodilla_sofia_20250605.pdf',
    './files/estudios/tomografia_rodilla_sofia_20250605.pdf',
    'TAC de rodilla con contraste'
  ),
  -- Estudios de Martín Ruiz
  (
    (
      SELECT idPaciente
      FROM pacientes
      WHERE dni = '54321098'
    ),
    (
      SELECT idDoctor
      FROM doctores
      WHERE dni = '45678901'
    ),
    '2025-06-20',
    NOW(),
    'analisis_sangre_martin_20250620.pdf',
    './files/estudios/analisis_sangre_martin_20250620.pdf',
    'Análisis de sangre completo - Valores dentro del rango normal'
  ),
  -- Estudios de Valentina Morales
  (
    (
      SELECT idPaciente
      FROM pacientes
      WHERE dni = '43210987'
    ),
    (
      SELECT idDoctor
      FROM doctores
      WHERE dni = '56789012'
    ),
    '2025-06-22',
    NOW(),
    'ecografia_pelvica_valentina_20250622.pdf',
    './files/estudios/ecografia_pelvica_valentina_20250622.pdf',
    'Ecografía pélvica transvaginal - Sin alteraciones'
  ),
  (
    (
      SELECT idPaciente
      FROM pacientes
      WHERE dni = '43210987'
    ),
    (
      SELECT idDoctor
      FROM doctores
      WHERE dni = '56789012'
    ),
    '2025-06-08',
    NOW(),
    'mamografia_valentina_20250608.pdf',
    './files/estudios/mamografia_valentina_20250608.pdf',
    'Mamografía bilateral - BIRADS 1'
  ),
  -- Estudios de Fernando Castro
  (
    (
      SELECT idPaciente
      FROM pacientes
      WHERE dni = '32109876'
    ),
    (
      SELECT idDoctor
      FROM doctores
      WHERE dni = '23456789'
    ),
    '2025-06-15',
    NOW(),
    'tomografia_cerebral_fernando_20250615.pdf',
    './files/estudios/tomografia_cerebral_fernando_20250615.pdf',
    'TAC cerebral sin contraste - Normal'
  ),
  -- Estudios de Camila Ramos
  (
    (
      SELECT idPaciente
      FROM pacientes
      WHERE dni = '21098765'
    ),
    (
      SELECT idDoctor
      FROM doctores
      WHERE dni = '12345678'
    ),
    '2025-06-12',
    NOW(),
    'holter_24h_camila_20250612.pdf',
    './files/estudios/holter_24h_camila_20250612.pdf',
    'Holter de 24 horas - Ritmo sinusal normal'
  ),
  -- Estudios de Alejandro Vega
  (
    (
      SELECT idPaciente
      FROM pacientes
      WHERE dni = '10987654'
    ),
    (
      SELECT idDoctor
      FROM doctores
      WHERE dni = '34567890'
    ),
    '2025-06-25',
    NOW(),
    'radiografia_columna_alejandro_20250625.jpg',
    './files/estudios/radiografia_columna_alejandro_20250625.jpg',
    'Radiografía de columna lumbar - Leve escoliosis'
  );
-- Consultas útiles para verificar los datos insertados:
-- SELECT * FROM usuarios WHERE dni IN ('12345678', '23456789', '87654321', '76543210');
-- SELECT d.*, u.nombre, u.apellido FROM doctores d JOIN usuarios u ON d.dni = u.dni;
-- SELECT p.*, u.nombre, u.apellido FROM pacientes p JOIN usuarios u ON p.dni = u.dni;
-- SELECT COUNT(*) as total_estudios FROM estudios;
-- SELECT e.*, u1.nombre as nombre_paciente, u2.nombre as nombre_doctor 
-- FROM estudios e 
-- JOIN pacientes p ON e.idPaciente = p.idPaciente 
-- JOIN usuarios u1 ON p.dni = u1.dni 
-- JOIN doctores d ON e.idDoctor = d.idDoctor 
-- JOIN usuarios u2 ON d.dni = u2.dni;