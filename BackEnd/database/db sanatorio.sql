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
VALUES ("");
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