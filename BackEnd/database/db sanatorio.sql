-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: sanatorio2
-- ------------------------------------------------------
-- Server version	8.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `idAdmin` int NOT NULL AUTO_INCREMENT,
  `usuario` varchar(50) NOT NULL,
  `contra` varchar(45) NOT NULL,
  PRIMARY KEY (`idAdmin`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'admin','admin');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctores`
--

DROP TABLE IF EXISTS `doctores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctores` (
  `idDoctor` int NOT NULL AUTO_INCREMENT,
  `dni` int NOT NULL,
  `duracionTurno` int NOT NULL,
  `contra` varchar(45) NOT NULL,
  `estado` varchar(45) NOT NULL,
  PRIMARY KEY (`idDoctor`),
  KEY `dni` (`dni`),
  CONSTRAINT `doctores_ibfk_1` FOREIGN KEY (`dni`) REFERENCES `usuarios` (`dni`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctores`
--

LOCK TABLES `doctores` WRITE;
/*!40000 ALTER TABLE `doctores` DISABLE KEYS */;
INSERT INTO `doctores` VALUES (1,23456789,20,'contra123','Habilitado'),(2,34567890,30,'pass456','Habilitado');
/*!40000 ALTER TABLE `doctores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `especialidades`
--

DROP TABLE IF EXISTS `especialidades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `especialidades` (
  `idEspecialidad` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `estado` varchar(45) NOT NULL,
  PRIMARY KEY (`idEspecialidad`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `especialidades`
--

LOCK TABLES `especialidades` WRITE;
/*!40000 ALTER TABLE `especialidades` DISABLE KEYS */;
INSERT INTO `especialidades` VALUES (1,'Cardiología','Habilitado'),(2,'Dermatología','Habilitado'),(3,'Pediatría','Habilitado'),(4,'Clínica Médica','Habilitado'),(5,'Odontología','Habilitado');
/*!40000 ALTER TABLE `especialidades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estudios`
--

DROP TABLE IF EXISTS `estudios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estudios` (
  `idEstudio` int NOT NULL AUTO_INCREMENT,
  `idPaciente` int NOT NULL,
  `idDoctor` int NOT NULL,
  `fechaRealizacion` date NOT NULL,
  `fechaCarga` datetime NOT NULL,
  `nombreArchivo` varchar(255) NOT NULL,
  `rutaArchivo` varchar(255) NOT NULL,
  `descripcion` text,
  PRIMARY KEY (`idEstudio`),
  KEY `idPaciente` (`idPaciente`),
  KEY `idDoctor` (`idDoctor`),
  CONSTRAINT `estudios_ibfk_1` FOREIGN KEY (`idPaciente`) REFERENCES `pacientes` (`idPaciente`),
  CONSTRAINT `estudios_ibfk_2` FOREIGN KEY (`idDoctor`) REFERENCES `doctores` (`idDoctor`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estudios`
--

LOCK TABLES `estudios` WRITE;
/*!40000 ALTER TABLE `estudios` DISABLE KEYS */;
INSERT INTO `estudios` VALUES (2,2,1,'2025-06-25','2025-06-25 21:18:36','TP-Subnetting.pdf','files\\estudios\\estudio-1750897116243-668976523.pdf','Análisis de redes - Documento de estudio para paciente Ana Lopez'),(3,1,1,'2025-06-25','2025-06-26 08:57:43','estudio-octavio.pdf','files\\estudios\\estudio-1750939063350-109806543.pdf','Estudio médico completo para seguimiento del paciente Octavio Berlanda'),(4,1,1,'2025-06-19','2025-06-26 09:08:37','carÃ¡tula.pdf','files\\estudios\\estudio-1750939717004-553611039.pdf',''),(5,1,1,'2025-06-13','2025-06-26 11:44:44','contratos-2025-06-05-1131.excalidraw.png','files\\estudios\\estudio-1750949084213-181348620.png','');
/*!40000 ALTER TABLE `estudios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fechas`
--

DROP TABLE IF EXISTS `fechas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fechas` (
  `fechas` date NOT NULL,
  PRIMARY KEY (`fechas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fechas`
--

LOCK TABLES `fechas` WRITE;
/*!40000 ALTER TABLE `fechas` DISABLE KEYS */;
INSERT INTO `fechas` VALUES ('2025-06-25'),('2025-06-26'),('2025-06-27'),('2025-06-28'),('2025-06-29'),('2025-06-30'),('2025-07-01'),('2025-07-02'),('2025-07-03'),('2025-07-04'),('2025-07-05'),('2025-07-06'),('2025-07-07'),('2025-07-08'),('2025-07-09'),('2025-07-10'),('2025-07-11'),('2025-07-12'),('2025-07-13'),('2025-07-14'),('2025-07-15'),('2025-07-16'),('2025-07-17'),('2025-07-18'),('2025-07-19'),('2025-07-20'),('2025-07-21'),('2025-07-22'),('2025-07-23'),('2025-07-24'),('2025-07-25'),('2025-07-26'),('2025-07-27'),('2025-07-28'),('2025-07-29'),('2025-07-30'),('2025-07-31'),('2025-08-01'),('2025-08-02'),('2025-08-03'),('2025-08-04'),('2025-08-05'),('2025-08-06'),('2025-08-07'),('2025-08-08'),('2025-08-09'),('2025-08-10'),('2025-08-11'),('2025-08-12'),('2025-08-13'),('2025-08-14'),('2025-08-15'),('2025-08-16'),('2025-08-17'),('2025-08-18'),('2025-08-19'),('2025-08-20'),('2025-08-21'),('2025-08-22'),('2025-08-23'),('2025-08-24'),('2025-08-25'),('2025-08-26'),('2025-08-27'),('2025-08-28'),('2025-08-29'),('2025-08-30'),('2025-08-31'),('2025-09-01'),('2025-09-02'),('2025-09-03'),('2025-09-04'),('2025-09-05'),('2025-09-06'),('2025-09-07'),('2025-09-08'),('2025-09-09'),('2025-09-10'),('2025-09-11'),('2025-09-12'),('2025-09-13'),('2025-09-14'),('2025-09-15'),('2025-09-16'),('2025-09-17'),('2025-09-18'),('2025-09-19'),('2025-09-20'),('2025-09-21'),('2025-09-22'),('2025-09-23'),('2025-09-24'),('2025-09-25'),('2025-09-26'),('2025-09-27'),('2025-09-28'),('2025-09-29'),('2025-09-30'),('2025-10-01'),('2025-10-02'),('2025-10-03'),('2025-10-04'),('2025-10-05'),('2025-10-06'),('2025-10-07'),('2025-10-08'),('2025-10-09'),('2025-10-10'),('2025-10-11'),('2025-10-12'),('2025-10-13'),('2025-10-14'),('2025-10-15'),('2025-10-16'),('2025-10-17'),('2025-10-18'),('2025-10-19'),('2025-10-20'),('2025-10-21'),('2025-10-22'),('2025-10-23'),('2025-10-24'),('2025-10-25'),('2025-10-26'),('2025-10-27'),('2025-10-28'),('2025-10-29'),('2025-10-30'),('2025-10-31'),('2025-11-01'),('2025-11-02'),('2025-11-03'),('2025-11-04'),('2025-11-05'),('2025-11-06'),('2025-11-07'),('2025-11-08'),('2025-11-09'),('2025-11-10'),('2025-11-11'),('2025-11-12'),('2025-11-13'),('2025-11-14'),('2025-11-15'),('2025-11-16'),('2025-11-17'),('2025-11-18'),('2025-11-19'),('2025-11-20'),('2025-11-21'),('2025-11-22'),('2025-11-23'),('2025-11-24'),('2025-11-25'),('2025-11-26'),('2025-11-27'),('2025-11-28'),('2025-11-29'),('2025-11-30'),('2025-12-01'),('2025-12-02'),('2025-12-03'),('2025-12-04'),('2025-12-05'),('2025-12-06'),('2025-12-07'),('2025-12-08'),('2025-12-09'),('2025-12-10'),('2025-12-11'),('2025-12-12'),('2025-12-13'),('2025-12-14'),('2025-12-15'),('2025-12-16'),('2025-12-17'),('2025-12-18'),('2025-12-19'),('2025-12-20'),('2025-12-21'),('2025-12-22'),('2025-12-23'),('2025-12-24'),('2025-12-25'),('2025-12-26'),('2025-12-27'),('2025-12-28'),('2025-12-29'),('2025-12-30'),('2025-12-31'),('2026-01-01'),('2026-01-02'),('2026-01-03'),('2026-01-04'),('2026-01-05'),('2026-01-06'),('2026-01-07'),('2026-01-08'),('2026-01-09'),('2026-01-10'),('2026-01-11'),('2026-01-12'),('2026-01-13'),('2026-01-14'),('2026-01-15'),('2026-01-16'),('2026-01-17'),('2026-01-18'),('2026-01-19'),('2026-01-20'),('2026-01-21'),('2026-01-22'),('2026-01-23'),('2026-01-24'),('2026-01-25'),('2026-01-26'),('2026-01-27'),('2026-01-28'),('2026-01-29'),('2026-01-30'),('2026-01-31'),('2026-02-01'),('2026-02-02'),('2026-02-03'),('2026-02-04'),('2026-02-05'),('2026-02-06'),('2026-02-07'),('2026-02-08'),('2026-02-09'),('2026-02-10'),('2026-02-11'),('2026-02-12'),('2026-02-13'),('2026-02-14'),('2026-02-15'),('2026-02-16'),('2026-02-17'),('2026-02-18'),('2026-02-19'),('2026-02-20'),('2026-02-21'),('2026-02-22'),('2026-02-23'),('2026-02-24'),('2026-02-25'),('2026-02-26'),('2026-02-27'),('2026-02-28'),('2026-03-01'),('2026-03-02'),('2026-03-03'),('2026-03-04'),('2026-03-05'),('2026-03-06'),('2026-03-07'),('2026-03-08'),('2026-03-09'),('2026-03-10'),('2026-03-11'),('2026-03-12'),('2026-03-13'),('2026-03-14'),('2026-03-15'),('2026-03-16'),('2026-03-17'),('2026-03-18'),('2026-03-19'),('2026-03-20'),('2026-03-21'),('2026-03-22'),('2026-03-23'),('2026-03-24'),('2026-03-25');
/*!40000 ALTER TABLE `fechas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horarios_disponibles`
--

DROP TABLE IF EXISTS `horarios_disponibles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `horarios_disponibles` (
  `idSede` int NOT NULL,
  `idDoctor` int NOT NULL,
  `idEspecialidad` int NOT NULL,
  `dia` varchar(20) NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `estado` varchar(45) NOT NULL,
  PRIMARY KEY (`dia`,`hora_inicio`,`hora_fin`,`idSede`,`idDoctor`,`idEspecialidad`),
  KEY `idSede` (`idSede`),
  KEY `idDoctor` (`idDoctor`),
  KEY `idEspecialidad` (`idEspecialidad`),
  CONSTRAINT `horarios_disponibles_ibfk_1` FOREIGN KEY (`idSede`) REFERENCES `sedes` (`idSede`),
  CONSTRAINT `horarios_disponibles_ibfk_2` FOREIGN KEY (`idDoctor`) REFERENCES `doctores` (`idDoctor`),
  CONSTRAINT `horarios_disponibles_ibfk_3` FOREIGN KEY (`idEspecialidad`) REFERENCES `especialidades` (`idEspecialidad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horarios_disponibles`
--

LOCK TABLES `horarios_disponibles` WRITE;
/*!40000 ALTER TABLE `horarios_disponibles` DISABLE KEYS */;
INSERT INTO `horarios_disponibles` VALUES (1,1,1,'Lunes','09:00:00','12:00:00','Disponible'),(2,2,3,'Martes','10:00:00','13:00:00','Disponible'),(1,1,1,'Miércoles','14:00:00','17:00:00','Disponible'),(2,2,3,'Viernes','15:00:00','18:00:00','Disponible');
/*!40000 ALTER TABLE `horarios_disponibles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `obrasociales`
--

DROP TABLE IF EXISTS `obrasociales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `obrasociales` (
  `idObraSocial` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `estado` varchar(45) NOT NULL,
  PRIMARY KEY (`idObraSocial`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `obrasociales`
--

LOCK TABLES `obrasociales` WRITE;
/*!40000 ALTER TABLE `obrasociales` DISABLE KEYS */;
INSERT INTO `obrasociales` VALUES (1,'Particular','Habilitado'),(2,'OSDE','Habilitado'),(3,'Swiss Medical','Habilitado'),(4,'Galeno','Habilitado'),(5,'PAMI','Habilitado');
/*!40000 ALTER TABLE `obrasociales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pacientes`
--

DROP TABLE IF EXISTS `pacientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pacientes` (
  `idPaciente` int NOT NULL AUTO_INCREMENT,
  `dni` int NOT NULL,
  `estado` varchar(45) NOT NULL,
  PRIMARY KEY (`idPaciente`),
  KEY `dni` (`dni`),
  CONSTRAINT `pacientes_ibfk_1` FOREIGN KEY (`dni`) REFERENCES `usuarios` (`dni`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pacientes`
--

LOCK TABLES `pacientes` WRITE;
/*!40000 ALTER TABLE `pacientes` DISABLE KEYS */;
INSERT INTO `pacientes` VALUES (1,45505086,'Habilitado'),(2,12345678,'Habilitado'),(3,98765432,'Habilitado'),(4,12121212,'Habilitado');
/*!40000 ALTER TABLE `pacientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sededoctoresp`
--

DROP TABLE IF EXISTS `sededoctoresp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sededoctoresp` (
  `idSede` int NOT NULL,
  `idDoctor` int NOT NULL,
  `idEspecialidad` int NOT NULL,
  `estado` varchar(45) NOT NULL,
  PRIMARY KEY (`idSede`,`idDoctor`,`idEspecialidad`),
  KEY `idEspecialidad` (`idEspecialidad`),
  KEY `idDoctor` (`idDoctor`),
  CONSTRAINT `sededoctoresp_ibfk_1` FOREIGN KEY (`idEspecialidad`) REFERENCES `especialidades` (`idEspecialidad`),
  CONSTRAINT `sededoctoresp_ibfk_2` FOREIGN KEY (`idSede`) REFERENCES `sedes` (`idSede`),
  CONSTRAINT `sededoctoresp_ibfk_3` FOREIGN KEY (`idDoctor`) REFERENCES `doctores` (`idDoctor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sededoctoresp`
--

LOCK TABLES `sededoctoresp` WRITE;
/*!40000 ALTER TABLE `sededoctoresp` DISABLE KEYS */;
INSERT INTO `sededoctoresp` VALUES (1,1,1,'Habilitado'),(1,1,4,'Habilitado'),(2,2,3,'Habilitado'),(3,2,5,'Deshabilitado');
/*!40000 ALTER TABLE `sededoctoresp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sedes`
--

DROP TABLE IF EXISTS `sedes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sedes` (
  `idSede` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `direccion` varchar(100) NOT NULL,
  `estado` varchar(45) NOT NULL,
  PRIMARY KEY (`idSede`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sedes`
--

LOCK TABLES `sedes` WRITE;
/*!40000 ALTER TABLE `sedes` DISABLE KEYS */;
INSERT INTO `sedes` VALUES (1,'Sede Central','Av. Corrientes 1500','Habilitado'),(2,'Anexo Norte','Bv. Oroño 2345','Habilitado'),(3,'Anexo Sur','Calle 58 y 12','Habilitado'),(4,'Sede norte','Callao 1040','Habilitado');
/*!40000 ALTER TABLE `sedes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `turnos`
--

DROP TABLE IF EXISTS `turnos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `turnos` (
  `idTurno` int NOT NULL AUTO_INCREMENT,
  `idPaciente` int DEFAULT NULL,
  `fechaYHora` datetime DEFAULT NULL,
  `fechaCancelacion` datetime DEFAULT NULL,
  `fechaConfirmacion` datetime DEFAULT NULL,
  `estado` varchar(20) DEFAULT NULL,
  `idEspecialidad` int DEFAULT NULL,
  `idDoctor` int NOT NULL,
  `idSede` int DEFAULT NULL,
  `mail` int DEFAULT NULL,
  PRIMARY KEY (`idTurno`,`idDoctor`),
  KEY `idEspecialidad` (`idEspecialidad`),
  KEY `idDoctor` (`idDoctor`),
  KEY `idSede` (`idSede`),
  CONSTRAINT `turnos_ibfk_1` FOREIGN KEY (`idEspecialidad`) REFERENCES `especialidades` (`idEspecialidad`),
  CONSTRAINT `turnos_ibfk_2` FOREIGN KEY (`idDoctor`) REFERENCES `doctores` (`idDoctor`),
  CONSTRAINT `turnos_ibfk_3` FOREIGN KEY (`idSede`) REFERENCES `sedes` (`idSede`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `turnos`
--

LOCK TABLES `turnos` WRITE;
/*!40000 ALTER TABLE `turnos` DISABLE KEYS */;
INSERT INTO `turnos` VALUES (1,1,'2025-07-02 10:00:00',NULL,NULL,'Confirmado',1,1,1,NULL),(2,2,'2025-07-04 11:30:00',NULL,NULL,'Confirmado',3,2,2,NULL),(3,3,'2025-07-08 16:00:00',NULL,NULL,'Pendiente',5,2,3,NULL),(4,1,'2025-06-30 09:00:00',NULL,'2025-06-26 11:54:20','Confirmado',1,1,1,NULL);
/*!40000 ALTER TABLE `turnos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `dni` int NOT NULL,
  `fechaNacimiento` date NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `direccion` varchar(100) DEFAULT NULL,
  `idObraSocial` int DEFAULT NULL,
  PRIMARY KEY (`dni`),
  KEY `idObraSocial` (`idObraSocial`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`idObraSocial`) REFERENCES `obrasociales` (`idObraSocial`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (12121212,'2000-04-04','Juan','Gonzalez','111111111111','juang@example.com','San Martin 1222',3),(12345678,'1990-01-15','Ana','Lopez','9988776655','ana.lopez@example.com','Calle San Martin 500',1),(23456789,'1985-05-20','Maria','Garcia','1122334455','maria.garcia@gmail.com','Av. del Libertador 1000',2),(34567890,'1978-08-10','Carlos','Rodriguez','2233445577','carlos.rodriguez@gmail.com','Calle Falsa 123',3),(45505086,'2004-04-17','Octavio','Berlanda','3482253060','octaberlanda@gmail.com','2125 COLON',1),(98765432,'1995-11-30','Juan','Martinez','5544332211','juan.martinez@example.com','Calle Belgrano 250',4);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-08 12:41:45
