-- Medical Appointment System Database - English Schema
-- Direct translation of original Spanish schema to English
-- Database: sanatorio2_english

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
  `user` varchar(50) NOT NULL,
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
-- Table structure for table `doctors`
--

DROP TABLE IF EXISTS `doctors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctors` (
  `idDoctor` int NOT NULL AUTO_INCREMENT,
  `dni` int NOT NULL,
  `appointmentDuration` int NOT NULL,
  `password` varchar(45) NOT NULL,
  `status` varchar(45) NOT NULL,
  PRIMARY KEY (`idDoctor`),
  KEY `dni` (`dni`),
  CONSTRAINT `doctors_ibfk_1` FOREIGN KEY (`dni`) REFERENCES `users` (`dni`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctors`
--

LOCK TABLES `doctors` WRITE;
/*!40000 ALTER TABLE `doctors` DISABLE KEYS */;
INSERT INTO `doctors` VALUES (1,23456789,20,'contra123','Habilitado'),(2,34567890,30,'pass456','Habilitado');
/*!40000 ALTER TABLE `doctors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `specialties`
--

DROP TABLE IF EXISTS `specialties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `specialties` (
  `idSpecialty` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `status` varchar(45) NOT NULL,
  PRIMARY KEY (`idSpecialty`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `specialties`
--

LOCK TABLES `specialties` WRITE;
/*!40000 ALTER TABLE `specialties` DISABLE KEYS */;
INSERT INTO `specialties` VALUES (1,'Cardiología','Habilitado'),(2,'Dermatología','Habilitado'),(3,'Pediatría','Habilitado'),(4,'Clínica Médica','Habilitado'),(5,'Odontología','Habilitado');
/*!40000 ALTER TABLE `specialties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `studies`
--

DROP TABLE IF EXISTS `studies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `studies` (
  `idStudy` int NOT NULL AUTO_INCREMENT,
  `idPatient` int NOT NULL,
  `idDoctor` int NOT NULL,
  `performanceDate` date NOT NULL,
  `uploadDate` datetime NOT NULL,
  `fileName` varchar(255) NOT NULL,
  `filePath` varchar(255) NOT NULL,
  `description` text,
  PRIMARY KEY (`idStudy`),
  KEY `idPatient` (`idPatient`),
  KEY `idDoctor` (`idDoctor`),
  CONSTRAINT `studies_ibfk_1` FOREIGN KEY (`idPatient`) REFERENCES `patients` (`idPatient`),
  CONSTRAINT `studies_ibfk_2` FOREIGN KEY (`idDoctor`) REFERENCES `doctors` (`idDoctor`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studies`
--

LOCK TABLES `studies` WRITE;
/*!40000 ALTER TABLE `studies` DISABLE KEYS */;
INSERT INTO `studies` VALUES (2,2,1,'2025-06-25','2025-06-25 21:18:36','TP-Subnetting.pdf','files\\studies\\study-1750897116243-668976523.pdf','Análisis de redes - Documento de estudio para paciente Ana Lopez'),(3,1,1,'2025-06-25','2025-06-26 08:57:43','study-octavio.pdf','files\\studies\\study-1750939063350-109806543.pdf','Estudio médico completo para seguimiento del paciente Octavio Berlanda'),(4,1,1,'2025-06-19','2025-06-26 09:08:37','carÃ¡tula.pdf','files\\studies\\study-1750939717004-553611039.pdf',''),(5,1,1,'2025-06-13','2025-06-26 11:44:44','contratos-2025-06-05-1131.excalidraw.png','files\\studies\\study-1750949084213-181348620.png','');
/*!40000 ALTER TABLE `studies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dates`
--

DROP TABLE IF EXISTS `dates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dates` (
  `dates` date NOT NULL,
  PRIMARY KEY (`dates`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dates`
--

LOCK TABLES `dates` WRITE;
/*!40000 ALTER TABLE `dates` DISABLE KEYS */;
INSERT INTO `dates` VALUES ('2025-06-25'),('2025-06-26'),('2025-06-27'),('2025-06-28'),('2025-06-29'),('2025-06-30'),('2025-07-01'),('2025-07-02'),('2025-07-03'),('2025-07-04'),('2025-07-05'),('2025-07-06'),('2025-07-07'),('2025-07-08'),('2025-07-09'),('2025-07-10'),('2025-07-11'),('2025-07-12'),('2025-07-13'),('2025-07-14'),('2025-07-15'),('2025-07-16'),('2025-07-17'),('2025-07-18'),('2025-07-19'),('2025-07-20'),('2025-07-21'),('2025-07-22'),('2025-07-23'),('2025-07-24'),('2025-07-25'),('2025-07-26'),('2025-07-27'),('2025-07-28'),('2025-07-29'),('2025-07-30'),('2025-07-31'),('2025-08-01'),('2025-08-02'),('2025-08-03'),('2025-08-04'),('2025-08-05'),('2025-08-06'),('2025-08-07'),('2025-08-08'),('2025-08-09'),('2025-08-10'),('2025-08-11'),('2025-08-12'),('2025-08-13'),('2025-08-14'),('2025-08-15'),('2025-08-16'),('2025-08-17'),('2025-08-18'),('2025-08-19'),('2025-08-20'),('2025-08-21'),('2025-08-22'),('2025-08-23'),('2025-08-24'),('2025-08-25'),('2025-08-26'),('2025-08-27'),('2025-08-28'),('2025-08-29'),('2025-08-30'),('2025-08-31'),('2025-09-01'),('2025-09-02'),('2025-09-03'),('2025-09-04'),('2025-09-05'),('2025-09-06'),('2025-09-07'),('2025-09-08'),('2025-09-09'),('2025-09-10'),('2025-09-11'),('2025-09-12'),('2025-09-13'),('2025-09-14'),('2025-09-15'),('2025-09-16'),('2025-09-17'),('2025-09-18'),('2025-09-19'),('2025-09-20'),('2025-09-21'),('2025-09-22'),('2025-09-23'),('2025-09-24'),('2025-09-25'),('2025-09-26'),('2025-09-27'),('2025-09-28'),('2025-09-29'),('2025-09-30'),('2025-10-01'),('2025-10-02'),('2025-10-03'),('2025-10-04'),('2025-10-05'),('2025-10-06'),('2025-10-07'),('2025-10-08'),('2025-10-09'),('2025-10-10'),('2025-10-11'),('2025-10-12'),('2025-10-13'),('2025-10-14'),('2025-10-15'),('2025-10-16'),('2025-10-17'),('2025-10-18'),('2025-10-19'),('2025-10-20'),('2025-10-21'),('2025-10-22'),('2025-10-23'),('2025-10-24'),('2025-10-25'),('2025-10-26'),('2025-10-27'),('2025-10-28'),('2025-10-29'),('2025-10-30'),('2025-10-31'),('2025-11-01'),('2025-11-02'),('2025-11-03'),('2025-11-04'),('2025-11-05'),('2025-11-06'),('2025-11-07'),('2025-11-08'),('2025-11-09'),('2025-11-10'),('2025-11-11'),('2025-11-12'),('2025-11-13'),('2025-11-14'),('2025-11-15'),('2025-11-16'),('2025-11-17'),('2025-11-18'),('2025-11-19'),('2025-11-20'),('2025-11-21'),('2025-11-22'),('2025-11-23'),('2025-11-24'),('2025-11-25'),('2025-11-26'),('2025-11-27'),('2025-11-28'),('2025-11-29'),('2025-11-30'),('2025-12-01'),('2025-12-02'),('2025-12-03'),('2025-12-04'),('2025-12-05'),('2025-12-06'),('2025-12-07'),('2025-12-08'),('2025-12-09'),('2025-12-10'),('2025-12-11'),('2025-12-12'),('2025-12-13'),('2025-12-14'),('2025-12-15'),('2025-12-16'),('2025-12-17'),('2025-12-18'),('2025-12-19'),('2025-12-20'),('2025-12-21'),('2025-12-22'),('2025-12-23'),('2025-12-24'),('2025-12-25'),('2025-12-26'),('2025-12-27'),('2025-12-28'),('2025-12-29'),('2025-12-30'),('2025-12-31'),('2026-01-01'),('2026-01-02'),('2026-01-03'),('2026-01-04'),('2026-01-05'),('2026-01-06'),('2026-01-07'),('2026-01-08'),('2026-01-09'),('2026-01-10'),('2026-01-11'),('2026-01-12'),('2026-01-13'),('2026-01-14'),('2026-01-15'),('2026-01-16'),('2026-01-17'),('2026-01-18'),('2026-01-19'),('2026-01-20'),('2026-01-21'),('2026-01-22'),('2026-01-23'),('2026-01-24'),('2026-01-25'),('2026-01-26'),('2026-01-27'),('2026-01-28'),('2026-01-29'),('2026-01-30'),('2026-01-31'),('2026-02-01'),('2026-02-02'),('2026-02-03'),('2026-02-04'),('2026-02-05'),('2026-02-06'),('2026-02-07'),('2026-02-08'),('2026-02-09'),('2026-02-10'),('2026-02-11'),('2026-02-12'),('2026-02-13'),('2026-02-14'),('2026-02-15'),('2026-02-16'),('2026-02-17'),('2026-02-18'),('2026-02-19'),('2026-02-20'),('2026-02-21'),('2026-02-22'),('2026-02-23'),('2026-02-24'),('2026-02-25'),('2026-02-26'),('2026-02-27'),('2026-02-28'),('2026-03-01'),('2026-03-02'),('2026-03-03'),('2026-03-04'),('2026-03-05'),('2026-03-06'),('2026-03-07'),('2026-03-08'),('2026-03-09'),('2026-03-10'),('2026-03-11'),('2026-03-12'),('2026-03-13'),('2026-03-14'),('2026-03-15'),('2026-03-16'),('2026-03-17'),('2026-03-18'),('2026-03-19'),('2026-03-20'),('2026-03-21'),('2026-03-22'),('2026-03-23'),('2026-03-24'),('2026-03-25');
/*!40000 ALTER TABLE `dates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `available_schedules`
--

DROP TABLE IF EXISTS `available_schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `available_schedules` (
  `idSite` int NOT NULL,
  `idDoctor` int NOT NULL,
  `idSpecialty` int NOT NULL,
  `day` varchar(20) NOT NULL,
  `startTime` time NOT NULL,
  `endTime` time NOT NULL,
  `status` varchar(45) NOT NULL,
  PRIMARY KEY (`day`,`startTime`,`endTime`,`idSite`,`idDoctor`,`idSpecialty`),
  KEY `idSite` (`idSite`),
  KEY `idDoctor` (`idDoctor`),
  KEY `idSpecialty` (`idSpecialty`),
  CONSTRAINT `available_schedules_ibfk_1` FOREIGN KEY (`idSite`) REFERENCES `sites` (`idSite`),
  CONSTRAINT `available_schedules_ibfk_2` FOREIGN KEY (`idDoctor`) REFERENCES `doctors` (`idDoctor`),
  CONSTRAINT `available_schedules_ibfk_3` FOREIGN KEY (`idSpecialty`) REFERENCES `specialties` (`idSpecialty`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `available_schedules`
--

LOCK TABLES `available_schedules` WRITE;
/*!40000 ALTER TABLE `available_schedules` DISABLE KEYS */;
INSERT INTO `available_schedules` VALUES (1,1,1,'Lunes','09:00:00','12:00:00','Disponible'),(2,2,3,'Martes','10:00:00','13:00:00','Disponible'),(1,1,1,'Miércoles','14:00:00','17:00:00','Disponible'),(2,2,3,'Viernes','15:00:00','18:00:00','Disponible');
/*!40000 ALTER TABLE `available_schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `insurance_companies`
--

DROP TABLE IF EXISTS `insurance_companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `insurance_companies` (
  `idInsuranceCompany` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `status` varchar(45) NOT NULL,
  PRIMARY KEY (`idInsuranceCompany`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `insurance_companies`
--

LOCK TABLES `insurance_companies` WRITE;
/*!40000 ALTER TABLE `insurance_companies` DISABLE KEYS */;
INSERT INTO `insurance_companies` VALUES (1,'Particular','Habilitado'),(2,'OSDE','Habilitado'),(3,'Swiss Medical','Habilitado'),(4,'Galeno','Habilitado'),(5,'PAMI','Habilitado');
/*!40000 ALTER TABLE `insurance_companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patients`
--

DROP TABLE IF EXISTS `patients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patients` (
  `idPatient` int NOT NULL AUTO_INCREMENT,
  `dni` int NOT NULL,
  `status` varchar(45) NOT NULL,
  PRIMARY KEY (`idPatient`),
  KEY `dni` (`dni`),
  CONSTRAINT `patients_ibfk_1` FOREIGN KEY (`dni`) REFERENCES `users` (`dni`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patients`
--

LOCK TABLES `patients` WRITE;
/*!40000 ALTER TABLE `patients` DISABLE KEYS */;
INSERT INTO `patients` VALUES (1,45505086,'Habilitado'),(2,12345678,'Habilitado'),(3,98765432,'Habilitado'),(4,12121212,'Habilitado');
/*!40000 ALTER TABLE `patients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sitedoctorspecialty`
--

DROP TABLE IF EXISTS `sitedoctorspecialty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sitedoctorspecialty` (
  `idSite` int NOT NULL,
  `idDoctor` int NOT NULL,
  `idSpecialty` int NOT NULL,
  `status` varchar(45) NOT NULL,
  PRIMARY KEY (`idSite`,`idDoctor`,`idSpecialty`),
  KEY `idSpecialty` (`idSpecialty`),
  KEY `idDoctor` (`idDoctor`),
  CONSTRAINT `sitedoctorspecialty_ibfk_1` FOREIGN KEY (`idSpecialty`) REFERENCES `specialties` (`idSpecialty`),
  CONSTRAINT `sitedoctorspecialty_ibfk_2` FOREIGN KEY (`idSite`) REFERENCES `sites` (`idSite`),
  CONSTRAINT `sitedoctorspecialty_ibfk_3` FOREIGN KEY (`idDoctor`) REFERENCES `doctors` (`idDoctor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sitedoctorspecialty`
--

LOCK TABLES `sitedoctorspecialty` WRITE;
/*!40000 ALTER TABLE `sitedoctorspecialty` DISABLE KEYS */;
INSERT INTO `sitedoctorspecialty` VALUES (1,1,1,'Habilitado'),(1,1,4,'Habilitado'),(2,2,3,'Habilitado'),(3,2,5,'Deshabilitado');
/*!40000 ALTER TABLE `sitedoctorspecialty` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sites`
--

DROP TABLE IF EXISTS `sites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sites` (
  `idSite` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `address` varchar(100) NOT NULL,
  `status` varchar(45) NOT NULL,
  PRIMARY KEY (`idSite`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sites`
--

LOCK TABLES `sites` WRITE;
/*!40000 ALTER TABLE `sites` DISABLE KEYS */;
INSERT INTO `sites` VALUES (1,'Sede Central','Av. Corrientes 1500','Habilitado'),(2,'Anexo Norte','Bv. Oroño 2345','Habilitado'),(3,'Anexo Sur','Calle 58 y 12','Habilitado'),(4,'Sede norte','Callao 1040','Habilitado');
/*!40000 ALTER TABLE `sites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointments` (
  `idAppointment` int NOT NULL AUTO_INCREMENT,
  `idPatient` int DEFAULT NULL,
  `dateTime` datetime DEFAULT NULL,
  `cancellationDate` datetime DEFAULT NULL,
  `confirmationDate` datetime DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `idSpecialty` int DEFAULT NULL,
  `idDoctor` int NOT NULL,
  `idSite` int DEFAULT NULL,
  `email` int DEFAULT NULL,
  PRIMARY KEY (`idAppointment`,`idDoctor`),
  KEY `idSpecialty` (`idSpecialty`),
  KEY `idDoctor` (`idDoctor`),
  KEY `idSite` (`idSite`),
  CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`idSpecialty`) REFERENCES `specialties` (`idSpecialty`),
  CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`idDoctor`) REFERENCES `doctors` (`idDoctor`),
  CONSTRAINT `appointments_ibfk_3` FOREIGN KEY (`idSite`) REFERENCES `sites` (`idSite`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments`
--

LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
INSERT INTO `appointments` VALUES (1,1,'2025-07-02 10:00:00',NULL,NULL,'Confirmado',1,1,1,NULL),(2,2,'2025-07-04 11:30:00',NULL,NULL,'Confirmado',3,2,2,NULL),(3,3,'2025-07-08 16:00:00',NULL,NULL,'Pendiente',5,2,3,NULL),(4,1,'2025-06-30 09:00:00',NULL,'2025-06-26 11:54:20','Confirmado',1,1,1,NULL);
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `dni` int NOT NULL,
  `birthDate` date NOT NULL,
  `firstName` varchar(100) NOT NULL,
  `lastName` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `idInsuranceCompany` int DEFAULT NULL,
  PRIMARY KEY (`dni`),
  KEY `idInsuranceCompany` (`idInsuranceCompany`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`idInsuranceCompany`) REFERENCES `insurance_companies` (`idInsuranceCompany`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (12121212,'2000-04-04','Juan','Gonzalez','111111111111','juang@example.com','San Martin 1222',3),(12345678,'1990-01-15','Ana','Lopez','9988776655','ana.lopez@example.com','Calle San Martin 500',1),(23456789,'1985-05-20','Maria','Garcia','1122334455','maria.garcia@gmail.com','Av. del Libertador 1000',2),(34567890,'1978-08-10','Carlos','Rodriguez','2233445577','carlos.rodriguez@gmail.com','Calle Falsa 123',3),(45505086,'2004-04-17','Octavio','Berlanda','3482253060','octaberlanda@gmail.com','2125 COLON',1),(98765432,'1995-11-30','Juan','Martinez','5544332211','juan.martinez@example.com','Calle Belgrano 250',4);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
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
