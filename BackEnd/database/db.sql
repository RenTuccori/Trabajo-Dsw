CREATE TABLE Usuarios (
  dni INT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  telefono VARCHAR(20),
  email VARCHAR(100),
  direccion VARCHAR(100),
  idObraSocial INT,
  FOREIGN KEY (idObraSocial) REFERENCES ObraSocial(idObraSocial)
);
CREATE TABLE ObraSociales (
  idObraSocial INT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL
);
CREATE TABLE Pacientes (
  idPaciente INT,
  dni INT PRIMARY KEY,
  FOREIGN KEY (dni) REFERENCES Usuarios(dni)
);
CREATE TABLE Doctores (
  idDoctor INT,
  dni INT PRIMARY KEY,
  FOREIGN KEY (dni) REFERENCES Usuarios(dni)
);
CREATE TABLE Especialidades (
  idEspecialidad INT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL
);
CREATE TABLE Turnos (
  idTurno INT AUTOINCREMENT,
  idHorario INT,
  idPaciente INT,
  fechaYHoraTurno DATE,
  fechaCancelacion DATE,
  fechaConfirmacion DATE,
  estado VARCHAR(20),
  idEspecialidad INT,
  idDoctor INT,
  idSede INT,
  PRIMARY KEY (idTurno, idHorario, idDoctor),
  FOREIGN KEY (idEspecialidad) REFERENCES Especialidades(idEspecialidad),
  FOREIGN KEY (idDoctor) REFERENCES Doctores(idDoctor),
  FOREIGN KEY (idSede) REFERENCES Sedes(idSede)
);
CREATE TABLE Sedes (
  idSede INT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  direccion VARCHAR(100) NOT NULL
);
CREATE TABLE SedeDoctorEsp (
  idSede INT,
  idDoctor INT,
  idEspecialidad INT,
  PRIMARY KEY (idSede, idDoctor, idEspecialidad),
  FOREIGN KEY (idEspecialidad) REFERENCES Especialidad(idEspecialidad),
  FOREIGN KEY (idSede) REFERENCES Sede(idSede),
  FOREIGN KEY (idDoctor) REFERENCES Doctores(idDoctor)
);