-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: sanatorio2
-- ------------------------------------------------------
-- Server version	8.4.0
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */
;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */
;
/*!50503 SET NAMES utf8 */
;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */
;
/*!40103 SET TIME_ZONE='+00:00' */
;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */
;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */
;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */
;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */
;
--
-- Table structure for table `admin`
--
DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `admin` (
  `idAdmin` int NOT NULL AUTO_INCREMENT,
  `usuario` varchar(50) NOT NULL,
  `contra` varchar(45) NOT NULL,
  PRIMARY KEY (`idAdmin`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `admin`
--
LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */
;
INSERT INTO `admin`
VALUES (1, 'admin', 'admin');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `doctores`
--
DROP TABLE IF EXISTS `doctores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `doctores` (
  `idDoctor` int NOT NULL AUTO_INCREMENT,
  `dni` int NOT NULL,
  `duracionTurno` int NOT NULL,
  `contra` varchar(45) NOT NULL,
  `estado` varchar(45) NOT NULL,
  PRIMARY KEY (`idDoctor`),
  KEY `dni` (`dni`),
  CONSTRAINT `doctores_ibfk_1` FOREIGN KEY (`dni`) REFERENCES `usuarios` (`dni`)
) ENGINE = InnoDB AUTO_INCREMENT = 10 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `doctores`
--
LOCK TABLES `doctores` WRITE;
/*!40000 ALTER TABLE `doctores` DISABLE KEYS */
;
/*!40000 ALTER TABLE `doctores` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `especialidades`
--
DROP TABLE IF EXISTS `especialidades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `especialidades` (
  `idEspecialidad` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `estado` varchar(45) NOT NULL,
  PRIMARY KEY (`idEspecialidad`)
) ENGINE = InnoDB AUTO_INCREMENT = 21 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `especialidades`
--
LOCK TABLES `especialidades` WRITE;
/*!40000 ALTER TABLE `especialidades` DISABLE KEYS */
;
/*!40000 ALTER TABLE `especialidades` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `estudios`
--
DROP TABLE IF EXISTS `estudios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `estudios`
--
LOCK TABLES `estudios` WRITE;
/*!40000 ALTER TABLE `estudios` DISABLE KEYS */
;
/*!40000 ALTER TABLE `estudios` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `fechas`
--
DROP TABLE IF EXISTS `fechas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `fechas` (
  `fechas` date NOT NULL,
  PRIMARY KEY (`fechas`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `fechas`
--
LOCK TABLES `fechas` WRITE;
/*!40000 ALTER TABLE `fechas` DISABLE KEYS */
;
INSERT INTO `fechas`
VALUES ('2024-08-14'),
('2024-08-15'),
('2024-08-16'),
('2024-08-17'),
('2024-08-18'),
('2024-08-19'),
('2024-08-20'),
('2024-08-21'),
('2024-08-22'),
('2024-08-23'),
('2024-08-24'),
('2024-08-25'),
('2024-08-26'),
('2024-08-27'),
('2024-08-28'),
('2024-08-29'),
('2024-08-30'),
('2024-08-31'),
('2024-09-01'),
('2024-09-02'),
('2024-09-03'),
('2024-09-04'),
('2024-09-05'),
('2024-09-06'),
('2024-09-07'),
('2024-09-08'),
('2024-09-09'),
('2024-09-10'),
('2024-09-11'),
('2024-09-12'),
('2024-09-13'),
('2024-09-14'),
('2024-09-15'),
('2024-09-16'),
('2024-09-17'),
('2024-09-18'),
('2024-09-19'),
('2024-09-20'),
('2024-09-21'),
('2024-09-22'),
('2024-09-23'),
('2024-09-24'),
('2024-09-25'),
('2024-09-26'),
('2024-09-27'),
('2024-09-28'),
('2024-09-29'),
('2024-09-30'),
('2024-10-01'),
('2024-10-02'),
('2024-10-03'),
('2024-10-04'),
('2024-10-05'),
('2024-10-06'),
('2024-10-07'),
('2024-10-08'),
('2024-10-09'),
('2024-10-10'),
('2024-10-11'),
('2024-10-12'),
('2024-10-13'),
('2024-10-14'),
('2024-10-15'),
('2024-10-16'),
('2024-10-17'),
('2024-10-18'),
('2024-10-19'),
('2024-10-20'),
('2024-10-21'),
('2024-10-22'),
('2024-10-23'),
('2024-10-24'),
('2024-10-25'),
('2024-10-26'),
('2024-10-27'),
('2024-10-28'),
('2024-10-29'),
('2024-10-30'),
('2024-10-31'),
('2024-11-01'),
('2024-11-02'),
('2024-11-03'),
('2024-11-04'),
('2024-11-05'),
('2024-11-06'),
('2024-11-07'),
('2024-11-08'),
('2024-11-09'),
('2024-11-10'),
('2024-11-11'),
('2024-11-12'),
('2024-11-13'),
('2024-11-14'),
('2024-11-15'),
('2024-11-16'),
('2024-11-17'),
('2024-11-18'),
('2024-11-19'),
('2024-11-20'),
('2024-11-21'),
('2024-11-22'),
('2024-11-23'),
('2024-11-24'),
('2024-11-25'),
('2024-11-26'),
('2024-11-27'),
('2024-11-28'),
('2024-11-29'),
('2024-11-30'),
('2024-12-01'),
('2024-12-02'),
('2024-12-03'),
('2024-12-04'),
('2024-12-05'),
('2024-12-06'),
('2024-12-07'),
('2024-12-08'),
('2024-12-09'),
('2024-12-10'),
('2024-12-11'),
('2024-12-12'),
('2024-12-13'),
('2024-12-14'),
('2024-12-15'),
('2024-12-16'),
('2024-12-17'),
('2024-12-18'),
('2024-12-19'),
('2024-12-20'),
('2024-12-21'),
('2024-12-22'),
('2024-12-23'),
('2024-12-24'),
('2024-12-25'),
('2024-12-26'),
('2024-12-27'),
('2024-12-28'),
('2024-12-29'),
('2024-12-30'),
('2024-12-31'),
('2025-01-01'),
('2025-01-02'),
('2025-01-03'),
('2025-01-04'),
('2025-01-05'),
('2025-01-06'),
('2025-01-07'),
('2025-01-08'),
('2025-01-09'),
('2025-01-10'),
('2025-01-11'),
('2025-01-12'),
('2025-01-13'),
('2025-01-14'),
('2025-01-15'),
('2025-01-16'),
('2025-01-17'),
('2025-01-18'),
('2025-01-19'),
('2025-01-20'),
('2025-01-21'),
('2025-01-22'),
('2025-01-23'),
('2025-01-24'),
('2025-01-25'),
('2025-01-26'),
('2025-01-27'),
('2025-01-28'),
('2025-01-29'),
('2025-01-30'),
('2025-01-31'),
('2025-02-01'),
('2025-02-02'),
('2025-02-03'),
('2025-02-04'),
('2025-02-05'),
('2025-02-06'),
('2025-02-07'),
('2025-02-08'),
('2025-02-09'),
('2025-02-10'),
('2025-02-11'),
('2025-02-12'),
('2025-02-13'),
('2025-02-14'),
('2025-02-15'),
('2025-02-16'),
('2025-02-17'),
('2025-02-18'),
('2025-02-19'),
('2025-02-20'),
('2025-02-21'),
('2025-02-22'),
('2025-02-23'),
('2025-02-24'),
('2025-02-25'),
('2025-02-26'),
('2025-02-27'),
('2025-02-28'),
('2025-03-01'),
('2025-03-02'),
('2025-03-03'),
('2025-03-04'),
('2025-03-05'),
('2025-03-06'),
('2025-03-07'),
('2025-03-08'),
('2025-03-09'),
('2025-03-10'),
('2025-03-11'),
('2025-03-12'),
('2025-03-13'),
('2025-03-14'),
('2025-03-15'),
('2025-03-16'),
('2025-03-17'),
('2025-03-18'),
('2025-03-19'),
('2025-03-20'),
('2025-03-21'),
('2025-03-22'),
('2025-03-23'),
('2025-03-24'),
('2025-03-25'),
('2025-03-26'),
('2025-03-27'),
('2025-03-28'),
('2025-03-29'),
('2025-03-30'),
('2025-03-31'),
('2025-04-01'),
('2025-04-02'),
('2025-04-03'),
('2025-04-04'),
('2025-04-05'),
('2025-04-06'),
('2025-04-07'),
('2025-04-08'),
('2025-04-09'),
('2025-04-10'),
('2025-04-11'),
('2025-04-12'),
('2025-04-13'),
('2025-04-14'),
('2025-04-15'),
('2025-04-16'),
('2025-04-17'),
('2025-04-18'),
('2025-04-19'),
('2025-04-20'),
('2025-04-21'),
('2025-04-22'),
('2025-04-23'),
('2025-04-24'),
('2025-04-25'),
('2025-04-26'),
('2025-04-27'),
('2025-04-28'),
('2025-04-29'),
('2025-04-30'),
('2025-05-01'),
('2025-05-02'),
('2025-05-03'),
('2025-05-04'),
('2025-05-05'),
('2025-05-06'),
('2025-05-07'),
('2025-05-08'),
('2025-05-09'),
('2025-05-10'),
('2025-05-11'),
('2025-05-12'),
('2025-05-13'),
('2025-05-14'),
('2025-05-15'),
('2025-05-16'),
('2025-05-17'),
('2025-05-18'),
('2025-05-19'),
('2025-05-20'),
('2025-05-21'),
('2025-05-22'),
('2025-05-23'),
('2025-05-24'),
('2025-05-25'),
('2025-05-26'),
('2025-05-27'),
('2025-05-28'),
('2025-05-29'),
('2025-05-30'),
('2025-05-31'),
('2025-06-01'),
('2025-06-02'),
('2025-06-03'),
('2025-06-04'),
('2025-06-05'),
('2025-06-06'),
('2025-06-07'),
('2025-06-08'),
('2025-06-09'),
('2025-06-10'),
('2025-06-11'),
('2025-06-12'),
('2025-06-13'),
('2025-06-14'),
('2025-06-15'),
('2025-06-16'),
('2025-06-17'),
('2025-06-18'),
('2025-06-19'),
('2025-06-20'),
('2025-06-21'),
('2025-06-22'),
('2025-06-23'),
('2025-06-24'),
('2025-06-25'),
('2025-06-26'),
('2025-06-27'),
('2025-06-28'),
('2025-06-29'),
('2025-06-30'),
('2025-07-01'),
('2025-07-02'),
('2025-07-03'),
('2025-07-04'),
('2025-07-05'),
('2025-07-06'),
('2025-07-07'),
('2025-07-08'),
('2025-07-09'),
('2025-07-10'),
('2025-07-11'),
('2025-07-12'),
('2025-07-13'),
('2025-07-14'),
('2025-07-15'),
('2025-07-16'),
('2025-07-17'),
('2025-07-18'),
('2025-07-19'),
('2025-07-20'),
('2025-07-21'),
('2025-07-22'),
('2025-07-23'),
('2025-07-24'),
('2025-07-25'),
('2025-07-26'),
('2025-07-27'),
('2025-07-28'),
('2025-07-29'),
('2025-07-30'),
('2025-07-31'),
('2025-08-01'),
('2025-08-02'),
('2025-08-03'),
('2025-08-04'),
('2025-08-05'),
('2025-08-06'),
('2025-08-07'),
('2025-08-08'),
('2025-08-09'),
('2025-08-10'),
('2025-08-11'),
('2025-08-12'),
('2025-08-13'),
('2025-08-14');
/*!40000 ALTER TABLE `fechas` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `horarios_disponibles`
--
DROP TABLE IF EXISTS `horarios_disponibles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `horarios_disponibles` (
  `idSede` int NOT NULL,
  `idDoctor` int NOT NULL,
  `idEspecialidad` int NOT NULL,
  `dia` varchar(20) NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `estado` varchar(45) NOT NULL,
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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `horarios_disponibles`
--
LOCK TABLES `horarios_disponibles` WRITE;
/*!40000 ALTER TABLE `horarios_disponibles` DISABLE KEYS */
;
/*!40000 ALTER TABLE `horarios_disponibles` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `obrasociales`
--
DROP TABLE IF EXISTS `obrasociales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `obrasociales` (
  `idObraSocial` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `estado` varchar(45) NOT NULL,
  PRIMARY KEY (`idObraSocial`)
) ENGINE = InnoDB AUTO_INCREMENT = 21 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `obrasociales`
--
LOCK TABLES `obrasociales` WRITE;
/*!40000 ALTER TABLE `obrasociales` DISABLE KEYS */
;
/*!40000 ALTER TABLE `obrasociales` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `pacientes`
--
DROP TABLE IF EXISTS `pacientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `pacientes` (
  `idPaciente` int NOT NULL AUTO_INCREMENT,
  `dni` int NOT NULL,
  `estado` varchar(45) NOT NULL,
  PRIMARY KEY (`idPaciente`),
  KEY `dni` (`dni`),
  CONSTRAINT `pacientes_ibfk_1` FOREIGN KEY (`dni`) REFERENCES `usuarios` (`dni`)
) ENGINE = InnoDB AUTO_INCREMENT = 12 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `pacientes`
--
LOCK TABLES `pacientes` WRITE;
/*!40000 ALTER TABLE `pacientes` DISABLE KEYS */
;
/*!40000 ALTER TABLE `pacientes` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `sededoctoresp`
--
DROP TABLE IF EXISTS `sededoctoresp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `sededoctoresp` (
  `idSede` int NOT NULL,
  `idDoctor` int NOT NULL,
  `idEspecialidad` int NOT NULL,
  `estado` varchar(45) NOT NULL,
  PRIMARY KEY (`idSede`, `idDoctor`, `idEspecialidad`),
  KEY `idEspecialidad` (`idEspecialidad`),
  KEY `idDoctor` (`idDoctor`),
  CONSTRAINT `sededoctoresp_ibfk_1` FOREIGN KEY (`idEspecialidad`) REFERENCES `especialidades` (`idEspecialidad`),
  CONSTRAINT `sededoctoresp_ibfk_2` FOREIGN KEY (`idSede`) REFERENCES `sedes` (`idSede`),
  CONSTRAINT `sededoctoresp_ibfk_3` FOREIGN KEY (`idDoctor`) REFERENCES `doctores` (`idDoctor`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `sededoctoresp`
--
LOCK TABLES `sededoctoresp` WRITE;
/*!40000 ALTER TABLE `sededoctoresp` DISABLE KEYS */
;
/*!40000 ALTER TABLE `sededoctoresp` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `sedes`
--
DROP TABLE IF EXISTS `sedes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `sedes` (
  `idSede` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `direccion` varchar(100) NOT NULL,
  `estado` varchar(45) NOT NULL,
  PRIMARY KEY (`idSede`)
) ENGINE = InnoDB AUTO_INCREMENT = 18 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `sedes`
--
LOCK TABLES `sedes` WRITE;
/*!40000 ALTER TABLE `sedes` DISABLE KEYS */
;
/*!40000 ALTER TABLE `sedes` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `turnos`
--
DROP TABLE IF EXISTS `turnos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
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
  PRIMARY KEY (`idTurno`, `idDoctor`),
  KEY `idEspecialidad` (`idEspecialidad`),
  KEY `idDoctor` (`idDoctor`),
  KEY `idSede` (`idSede`),
  CONSTRAINT `turnos_ibfk_1` FOREIGN KEY (`idEspecialidad`) REFERENCES `especialidades` (`idEspecialidad`),
  CONSTRAINT `turnos_ibfk_2` FOREIGN KEY (`idDoctor`) REFERENCES `doctores` (`idDoctor`),
  CONSTRAINT `turnos_ibfk_3` FOREIGN KEY (`idSede`) REFERENCES `sedes` (`idSede`)
) ENGINE = InnoDB AUTO_INCREMENT = 63 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `turnos`
--
LOCK TABLES `turnos` WRITE;
/*!40000 ALTER TABLE `turnos` DISABLE KEYS */
;
/*!40000 ALTER TABLE `turnos` ENABLE KEYS */
;
UNLOCK TABLES;
--
-- Table structure for table `usuarios`
--
DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Dumping data for table `usuarios`
--
LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */
;
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */
;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */
;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */
;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */
;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */
;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */
;
-- Dump completed on 2025-06-25 20:37:46