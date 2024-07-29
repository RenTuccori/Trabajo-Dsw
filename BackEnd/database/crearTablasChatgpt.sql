-- Insertando datos en la tabla ObraSociales
INSERT INTO ObraSociales (idObraSocial, nombre)
VALUES (1, 'Obra Social A'),
  (2, 'Obra Social B');
-- Insertando datos en la tabla Usuarios
INSERT INTO Usuarios (
    dni,
    nombre,
    apellido,
    telefono,
    email,
    direccion,
    idObraSocial
  )
VALUES (
    12345678,
    'Juan',
    'Pérez',
    '123456789',
    'juan.perez@example.com',
    'Calle Falsa 123',
    1
  ),
  (
    23456789,
    'María',
    'García',
    '987654321',
    'maria.garcia@example.com',
    'Avenida Siempre Viva 456',
    2
  );
-- Insertando datos en la tabla Pacientes
INSERT INTO Pacientes (idPaciente, dni)
VALUES (1, 12345678);
-- Insertando datos en la tabla Doctores
INSERT INTO Doctores (idDoctor, dni)
VALUES (1, 23456789);
-- Insertando datos en la tabla Especialidades
INSERT INTO Especialidades (idEspecialidad, nombre)
VALUES (1, 'Cardiología'),
  (2, 'Pediatría');
-- Insertando datos en la tabla Sedes
INSERT INTO Sedes (idSede, nombre, direccion)
VALUES (1, 'Sede Central', 'Calle Principal 123'),
  (2, 'Sede Norte', 'Avenida Norte 456');
-- Insertando datos en la tabla Turnos
INSERT INTO Turnos (
    idHorario,
    idPaciente,
    fecha,
    fechaCancelacion,
    fechaConfirmacion,
    estado,
    idEspecialidad,
    idDoctor,
    idSede
  )
VALUES (
    1,
    1,
    '2024-08-01',
    NULL,
    '2024-07-20',
    'Confirmado',
    1,
    1,
    1
  ),
  (
    2,
    1,
    '2024-08-02',
    NULL,
    NULL,
    'Pendiente',
    2,
    1,
    2
  );
-- Insertando datos en la tabla SedeDoctorEsp
INSERT INTO SedeDoctorEsp (idSede, idDoctor, idEspecialidad)
VALUES (1, 1, 1),
  (2, 1, 2);