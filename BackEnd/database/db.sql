CREATE TABLE `doctores` (
  `idDoctor` int NOT NULL,
  `dni` int DEFAULT NULL,
  PRIMARY KEY (`idDoctor`),
  KEY `dni` (`dni`),
  CONSTRAINT `doctores_ibfk_1` FOREIGN KEY (`dni`) REFERENCES `usuarios` (`dni`)
) CREATE TABLE `especialidades` (
  `idEspecialidad` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`idEspecialidad`)
) CREATE TABLE `horarios_disponibles` (
  `idSede` int NOT NULL,
  `idDoctor` int NOT NULL,
  `idEspecialidad` int NOT NULL,
  `dia` varchar(20) NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  PRIMARY KEY (
    `dia`,
    `hora_inicio`,
    `hora_fin`,
    `idSede`,
    `idDoctor`,
    `idEspecialidad`
  ),
  KEY `idSede` (`idSede`),
  KEY `idDoctor` (`idDoctor`),
  KEY `idEspecialidad` (`idEspecialidad`),
  CONSTRAINT `horarios_disponibles_ibfk_1` FOREIGN KEY (`idSede`) REFERENCES `sedes` (`idSede`),
  CONSTRAINT `horarios_disponibles_ibfk_2` FOREIGN KEY (`idDoctor`) REFERENCES `doctores` (`idDoctor`),
  CONSTRAINT `horarios_disponibles_ibfk_3` FOREIGN KEY (`idEspecialidad`) REFERENCES `especialidades` (`idEspecialidad`)
) CREATE TABLE `obrasociales` (
  `idObraSocial` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`idObraSocial`)
) CREATE TABLE `pacientes` (
  `idPaciente` int NOT NULL,
  `dni` int DEFAULT NULL,
  PRIMARY KEY (`idPaciente`),
  KEY `dni` (`dni`),
  CONSTRAINT `pacientes_ibfk_1` FOREIGN KEY (`dni`) REFERENCES `usuarios` (`dni`)
) CREATE TABLE `sededoctoresp` (
  `idSede` int NOT NULL,
  `idDoctor` int NOT NULL,
  `idEspecialidad` int NOT NULL,
  PRIMARY KEY (`idSede`, `idDoctor`, `idEspecialidad`),
  KEY `idEspecialidad` (`idEspecialidad`),
  KEY `idDoctor` (`idDoctor`),
  CONSTRAINT `sededoctoresp_ibfk_1` FOREIGN KEY (`idEspecialidad`) REFERENCES `especialidades` (`idEspecialidad`),
  CONSTRAINT `sededoctoresp_ibfk_2` FOREIGN KEY (`idSede`) REFERENCES `sedes` (`idSede`),
  CONSTRAINT `sededoctoresp_ibfk_3` FOREIGN KEY (`idDoctor`) REFERENCES `doctores` (`idDoctor`)
) CREATE TABLE `sedes` (
  `idSede` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `direccion` varchar(100) NOT NULL,
  PRIMARY KEY (`idSede`)
) CREATE TABLE `turnos` (
  `idTurno` int NOT NULL AUTO_INCREMENT,
  `idPaciente` int DEFAULT NULL,
  `fechaYHora` datetime DEFAULT NULL,
  `fechaCancelacion` datetime DEFAULT NULL,
  `fechaConfirmacion` datetime DEFAULT NULL,
  `estado` varchar(20) DEFAULT NULL,
  `idEspecialidad` int DEFAULT NULL,
  `idDoctor` int NOT NULL,
  `idSede` int DEFAULT NULL,
  PRIMARY KEY (`idTurno`, `idDoctor`),
  KEY `idEspecialidad` (`idEspecialidad`),
  KEY `idDoctor` (`idDoctor`),
  KEY `idSede` (`idSede`),
  CONSTRAINT `turnos_ibfk_1` FOREIGN KEY (`idEspecialidad`) REFERENCES `especialidades` (`idEspecialidad`),
  CONSTRAINT `turnos_ibfk_2` FOREIGN KEY (`idDoctor`) REFERENCES `doctores` (`idDoctor`),
  CONSTRAINT `turnos_ibfk_3` FOREIGN KEY (`idSede`) REFERENCES `sedes` (`idSede`)
) CREATE TABLE `usuarios` (
  `dni` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `direccion` varchar(100) DEFAULT NULL,
  `idObraSocial` int DEFAULT NULL,
  PRIMARY KEY (`dni`),
  KEY `idObraSocial` (`idObraSocial`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`idObraSocial`) REFERENCES `obrasociales` (`idObraSocial`)
) CREATE TABLE 'fechas' (
  `fechas` date NOT NULL,
  PRIMARY KEY (`fechas`)
)