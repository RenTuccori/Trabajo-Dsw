CREATE DATABASE IF NOT EXISTS clinic;
USE clinic;
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS=0;


-- Table: healthinsurances (no FK dependencies)
DROP TABLE IF EXISTS `healthinsurances`;
CREATE TABLE `healthinsurances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `status` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `healthinsurances` VALUES
  (1,'Particular','Enabled'),
  (2,'OSDE','Enabled'),
  (3,'Swiss Medical','Enabled'),
  (4,'Galeno','Enabled'),
  (5,'PAMI','Enabled'),
  (6,'(Sin obra social)','Enabled');


-- Table: users (depends on healthinsurances)
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `nationalId` int NOT NULL,
  `password` varchar(255) NOT NULL,
  `birthDate` date NOT NULL,
  `firstName` varchar(100) NOT NULL,
  `lastName` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` varchar(100) NOT NULL,
  `healthInsuranceId` int DEFAULT NULL,
  `status` varchar(45) NOT NULL DEFAULT 'Enabled',
  PRIMARY KEY (`nationalId`),
  KEY `healthInsuranceId` (`healthInsuranceId`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`healthInsuranceId`) REFERENCES `healthinsurances` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `users` VALUES
  (10987654,'$2b$10$WOFx0innOOhtvyMGo6eI../bmtbEuSf8WB6FHJsQy0oAJ18aU2uoa','1987-02-14','Alejandro','Vega','1121098765','alejandro.vega@email.com','Entre Rios 753',4),
  (12345678,'$2b$10$WOFx0innOOhtvyMGo6eI../bmtbEuSf8WB6FHJsQy0oAJ18aU2uoa','1980-05-15','Carlos','Rodriguez','1134567890','carlos.rodriguez@hospital.com','Av. Santa Fe 1000',2),
  (21098765,'$2b$10$WOFx0innOOhtvyMGo6eI../bmtbEuSf8WB6FHJsQy0oAJ18aU2uoa','1991-10-17','Camila','Ramos','1132109876','camila.ramos@email.com','Tucuman 159',3),
  (23456789,'$2b$10$WOFx0innOOhtvyMGo6eI../bmtbEuSf8WB6FHJsQy0oAJ18aU2uoa','1975-08-22','Maria','Gonzalez','1145678901','maria.gonzalez@hospital.com','Av. Callao 500',3),
  (32109876,'$2b$10$WOFx0innOOhtvyMGo6eI../bmtbEuSf8WB6FHJsQy0oAJ18aU2uoa','1983-07-28','Fernando','Castro','1143210987','fernando.castro@email.com','Alsina 987',2),
  (34567890,'$2b$10$WOFx0innOOhtvyMGo6eI../bmtbEuSf8WB6FHJsQy0oAJ18aU2uoa','1982-12-10','Juan','Lopez','1156789012','juan.lopez@hospital.com','Av. Corrientes 800',4),
  (43210987,'$2b$10$WOFx0innOOhtvyMGo6eI../bmtbEuSf8WB6FHJsQy0oAJ18aU2uoa','1995-12-03','Valentina','Morales','1154321098','valentina.morales@email.com','Sarmiento 654',1),
  (45678901,'$2b$10$WOFx0innOOhtvyMGo6eI../bmtbEuSf8WB6FHJsQy0oAJ18aU2uoa','1978-03-18','Ana','Martinez','1167890123','ana.martinez@hospital.com','Av. 9 de Julio 200',2),
  (54321098,'$2b$10$WOFx0innOOhtvyMGo6eI../bmtbEuSf8WB6FHJsQy0oAJ18aU2uoa','1988-04-08','Martin','Ruiz','1165432109','martin.ruiz@email.com','Mitre 321',5),
  (56789012,'$2b$10$WOFx0innOOhtvyMGo6eI../bmtbEuSf8WB6FHJsQy0oAJ18aU2uoa','1985-11-25','Roberto','Silva','1178901234','roberto.silva@hospital.com','Av. Las Heras 300',3),
  (65432109,'$2b$10$WOFx0innOOhtvyMGo6eI../bmtbEuSf8WB6FHJsQy0oAJ18aU2uoa','1992-09-12','Sofia','Torres','1176543210','sofia.torres@email.com','San Martin 789',4),
  (76543210,'$2b$10$WOFx0innOOhtvyMGo6eI../bmtbEuSf8WB6FHJsQy0oAJ18aU2uoa','1985-06-20','Diego','Perez','1187654321','diego.perez@email.com','Av. Belgrano 456',3),
  (87654321,'$2b$10$WOFx0innOOhtvyMGo6eI../bmtbEuSf8WB6FHJsQy0oAJ18aU2uoa','1990-01-15','Laura','Fernandez','1198765432','laura.fernandez@email.com','Calle Falsa 123',2);


-- Table: administrators (no FK dependencies)
DROP TABLE IF EXISTS `administrators`;
CREATE TABLE `administrators` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `administrators` VALUES (1,'admin','admin');


-- Table: specialties (no FK dependencies)
DROP TABLE IF EXISTS `specialties`;
CREATE TABLE `specialties` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `status` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `specialties` VALUES
  (1,'Cardiology','Enabled'),
  (2,'Neurology','Enabled'),
  (3,'Traumatology','Enabled'),
  (4,'Pediatrics','Enabled'),
  (5,'Gynecology','Enabled');


-- Table: locations (no FK dependencies)
DROP TABLE IF EXISTS `locations`;
CREATE TABLE `locations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `address` varchar(100) NOT NULL,
  `status` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `locations` VALUES
  (1,'Main Campus','Av. Cordoba 1234, CABA','Enabled'),
  (2,'North Campus','Av. Cabildo 5678, CABA','Enabled'),
  (3,'South Campus','Av. Rivadavia 9012, CABA','Enabled');


-- Table: doctors (depends on users)
DROP TABLE IF EXISTS `doctors`;
CREATE TABLE `doctors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nationalId` int NOT NULL,
  `appointmentDuration` int NOT NULL,
  `status` varchar(45) NOT NULL DEFAULT 'Enabled',
  PRIMARY KEY (`id`),
  KEY `nationalId` (`nationalId`),
  CONSTRAINT `doctors_ibfk_1` FOREIGN KEY (`nationalId`) REFERENCES `users` (`nationalId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `doctors` VALUES
  (1,12345678,30,'Enabled'),
  (2,23456789,45,'Enabled'),
  (3,34567890,30,'Enabled'),
  (4,45678901,60,'Enabled'),
  (5,56789012,30,'Enabled');


-- Table: patients (depends on users)
DROP TABLE IF EXISTS `patients`;
CREATE TABLE `patients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nationalId` int NOT NULL,
  `status` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `nationalId` (`nationalId`),
  CONSTRAINT `patients_ibfk_1` FOREIGN KEY (`nationalId`) REFERENCES `users` (`nationalId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `patients` VALUES
  (1,87654321,'Enabled'),
  (2,76543210,'Enabled'),
  (3,65432109,'Enabled'),
  (4,54321098,'Enabled'),
  (5,43210987,'Enabled'),
  (6,32109876,'Enabled'),
  (7,21098765,'Enabled'),
  (8,10987654,'Enabled');


-- Table: doctorspecialtylocations (depends on specialties, locations, doctors)
DROP TABLE IF EXISTS `doctorspecialtylocations`;
CREATE TABLE `doctorspecialtylocations` (
  `locationId` int NOT NULL,
  `doctorId` int NOT NULL,
  `specialtyId` int NOT NULL,
  `status` varchar(45) NOT NULL,
  PRIMARY KEY (`locationId`,`doctorId`,`specialtyId`),
  KEY `specialtyId` (`specialtyId`),
  KEY `doctorId` (`doctorId`),
  CONSTRAINT `doctorSpecialtyLocations_ibfk_1` FOREIGN KEY (`specialtyId`) REFERENCES `specialties` (`id`),
  CONSTRAINT `doctorSpecialtyLocations_ibfk_2` FOREIGN KEY (`locationId`) REFERENCES `locations` (`id`),
  CONSTRAINT `doctorSpecialtyLocations_ibfk_3` FOREIGN KEY (`doctorId`) REFERENCES `doctors` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `doctorspecialtylocations` VALUES
  (1,1,1,'Enabled'),
  (2,1,1,'Enabled'),
  (1,2,2,'Enabled'),
  (3,2,2,'Enabled'),
  (2,3,3,'Enabled'),
  (3,3,3,'Enabled'),
  (1,4,4,'Enabled'),
  (2,4,4,'Enabled'),
  (2,5,5,'Enabled'),
  (3,5,5,'Enabled');


-- Table: availableschedules (depends on locations, doctors, specialties)
DROP TABLE IF EXISTS `availableschedules`;
CREATE TABLE `availableschedules` (
  `locationId` int NOT NULL,
  `doctorId` int NOT NULL,
  `specialtyId` int NOT NULL,
  `day` varchar(20) NOT NULL,
  `startTime` time NOT NULL,
  `endTime` time NOT NULL,
  `status` varchar(45) NOT NULL,
  PRIMARY KEY (`day`,`startTime`,`endTime`,`locationId`,`doctorId`,`specialtyId`),
  KEY `locationId` (`locationId`),
  KEY `doctorId` (`doctorId`),
  KEY `specialtyId` (`specialtyId`),
  CONSTRAINT `availableSchedules_ibfk_1` FOREIGN KEY (`locationId`) REFERENCES `locations` (`id`),
  CONSTRAINT `availableSchedules_ibfk_2` FOREIGN KEY (`doctorId`) REFERENCES `doctors` (`id`),
  CONSTRAINT `availableSchedules_ibfk_3` FOREIGN KEY (`specialtyId`) REFERENCES `specialties` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `availableschedules` VALUES
  (1,1,1,'Monday','08:00:00','12:00:00','Available'),
  (1,1,1,'Wednesday','14:00:00','18:00:00','Available'),
  (2,1,1,'Tuesday','09:00:00','13:00:00','Available'),
  (1,2,2,'Monday','09:00:00','12:00:00','Available'),
  (1,2,2,'Thursday','15:00:00','18:00:00','Available'),
  (3,2,2,'Friday','08:00:00','11:00:00','Available'),
  (2,3,3,'Tuesday','08:00:00','12:00:00','Available'),
  (2,3,3,'Thursday','14:00:00','17:00:00','Available'),
  (1,4,4,'Monday','10:00:00','13:00:00','Available'),
  (2,5,5,'Wednesday','13:00:00','17:00:00','Available');


-- Table: appointments (depends on specialties, doctors, locations)
DROP TABLE IF EXISTS `appointments`;
CREATE TABLE `appointments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patientId` int DEFAULT NULL,
  `dateTime` datetime DEFAULT NULL,
  `cancellationDate` datetime DEFAULT NULL,
  `confirmationDate` datetime DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `specialtyId` int DEFAULT NULL,
  `doctorId` int NOT NULL,
  `locationId` int DEFAULT NULL,
  `emailSent` int DEFAULT NULL,
  PRIMARY KEY (`id`,`doctorId`),
  KEY `specialtyId` (`specialtyId`),
  KEY `doctorId` (`doctorId`),
  KEY `locationId` (`locationId`),
  CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`specialtyId`) REFERENCES `specialties` (`id`),
  CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`doctorId`) REFERENCES `doctors` (`id`),
  CONSTRAINT `appointments_ibfk_3` FOREIGN KEY (`locationId`) REFERENCES `locations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `appointments` VALUES
  (1,1,'2026-03-30 10:00:00',NULL,'2026-03-26 15:30:00','Confirmed',1,1,1,1),
  (2,2,'2026-04-02 09:30:00',NULL,NULL,'Pending',2,2,1,0),
  (3,3,'2026-04-07 14:00:00',NULL,NULL,'Pending',3,3,2,0),
  (4,4,'2026-03-20 11:00:00',NULL,'2026-03-18 10:00:00','Confirmed',4,4,1,1),
  (5,5,'2026-03-22 16:30:00',NULL,'2026-03-20 14:15:00','Confirmed',5,5,2,1),
  (6,6,'2026-03-15 08:30:00',NULL,'2026-03-12 09:45:00','Confirmed',2,2,3,1),
  (7,7,'2026-04-09 12:00:00','2026-04-07 18:10:00',NULL,'Cancelled',1,1,2,0),
  (8,8,'2026-04-10 15:30:00',NULL,NULL,'Pending',3,3,3,0);


-- Table: dates (no FK dependencies)
DROP TABLE IF EXISTS `dates`;
CREATE TABLE `dates` (
  `date` date NOT NULL,
  PRIMARY KEY (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `dates` (`date`) VALUES
  ('2026-02-16'),('2026-02-17'),('2026-02-18'),('2026-02-19'),('2026-02-20'),
  ('2026-02-23'),('2026-02-24'),('2026-02-25'),('2026-02-26'),('2026-02-27'),
  ('2026-03-02'),('2026-03-03'),('2026-03-04'),('2026-03-05'),('2026-03-06'),
  ('2026-03-09'),('2026-03-10'),('2026-03-11'),('2026-03-12'),('2026-03-13'),
  ('2026-03-16'),('2026-03-17'),('2026-03-18'),('2026-03-19'),('2026-03-20'),
  ('2026-03-23'),('2026-03-24'),('2026-03-25'),('2026-03-26'),('2026-03-27'),
  ('2026-03-30'),('2026-03-31'),
  ('2026-04-01'),('2026-04-02'),('2026-04-03'),('2026-04-06'),('2026-04-07'),
  ('2026-04-08'),('2026-04-09'),('2026-04-10'),('2026-04-13'),('2026-04-14'),
  ('2026-04-15'),('2026-04-16'),('2026-04-17'),('2026-04-20'),('2026-04-21'),
  ('2026-04-22'),('2026-04-23'),('2026-04-24'),('2026-04-27'),('2026-04-28'),
  ('2026-04-29'),('2026-04-30'),
  ('2026-05-04'),('2026-05-05'),('2026-05-06'),('2026-05-07'),('2026-05-08'),
  ('2026-05-11'),('2026-05-12'),('2026-05-13'),('2026-05-14'),('2026-05-15'),
  ('2026-05-18'),('2026-05-19'),('2026-05-20'),('2026-05-21'),('2026-05-22'),
  ('2026-05-25'),('2026-05-26'),('2026-05-27'),('2026-05-28'),('2026-05-29'),
  ('2026-06-01'),('2026-06-02'),('2026-06-03'),('2026-06-04'),('2026-06-05'),
  ('2026-06-08'),('2026-06-09'),('2026-06-10'),('2026-06-11'),('2026-06-12'),
  ('2026-06-15'),('2026-06-16'),('2026-06-17'),('2026-06-18'),('2026-06-19'),
  ('2026-06-22'),('2026-06-23'),('2026-06-24'),('2026-06-25'),('2026-06-26'),
  ('2026-06-29'),('2026-06-30'),
  ('2026-07-01'),('2026-07-02'),('2026-07-03'),('2026-07-06'),('2026-07-07'),
  ('2026-07-08'),('2026-07-09'),('2026-07-10'),('2026-07-13'),('2026-07-14'),
  ('2026-07-15'),('2026-07-16'),('2026-07-17'),('2026-07-20'),('2026-07-21'),
  ('2026-07-22'),('2026-07-23'),('2026-07-24'),('2026-07-27'),('2026-07-28'),
  ('2026-07-29'),('2026-07-30'),('2026-07-31'),
  ('2026-08-03'),('2026-08-04'),('2026-08-05'),('2026-08-06'),('2026-08-07'),
  ('2026-08-10'),('2026-08-11'),('2026-08-12'),('2026-08-13'),('2026-08-14'),
  ('2026-08-17'),('2026-08-18'),('2026-08-19'),('2026-08-20'),('2026-08-21'),
  ('2026-08-24'),('2026-08-25'),('2026-08-26'),('2026-08-27'),('2026-08-28'),
  ('2026-08-31');


-- Table: studies (depends on patients, doctors)
DROP TABLE IF EXISTS `studies`;
CREATE TABLE `studies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patientId` int NOT NULL,
  `doctorId` int NOT NULL,
  `performedDate` date NOT NULL,
  `uploadDate` datetime NOT NULL,
  `fileName` varchar(255) NOT NULL,
  `filePath` varchar(255) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  KEY `patientId` (`patientId`),
  KEY `doctorId` (`doctorId`),
  CONSTRAINT `studies_ibfk_1` FOREIGN KEY (`patientId`) REFERENCES `patients` (`id`),
  CONSTRAINT `studies_ibfk_2` FOREIGN KEY (`doctorId`) REFERENCES `doctors` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `studies` VALUES
  (1,1,1,'2026-03-20','2026-03-20 09:15:00','ecg_laura_20260320.pdf','files\\estudios\\ecg_laura_20260320.pdf','Routine electrocardiogram with normal findings'),
  (2,1,1,'2026-03-15','2026-03-15 10:10:00','echo_laura_20260315.pdf','files\\estudios\\echo_laura_20260315.pdf','Doppler echocardiogram with preserved ventricular function'),
  (3,2,2,'2026-03-18','2026-03-18 12:30:00','brain_mri_diego_20260318.pdf','files\\estudios\\brain_mri_diego_20260318.pdf','Brain MRI without significant findings'),
  (4,2,2,'2026-03-10','2026-03-10 11:20:00','eeg_diego_20260310.pdf','files\\estudios\\eeg_diego_20260310.pdf','Routine EEG with normal electrical activity'),
  (5,3,3,'2026-03-22','2026-03-22 16:00:00','knee_xray_sofia_20260322.jpg','files\\estudios\\knee_xray_sofia_20260322.jpg','Left knee X-ray suggestive of meniscal injury'),
  (6,3,3,'2026-03-05','2026-03-05 17:00:00','knee_ct_sofia_20260305.pdf','files\\estudios\\knee_ct_sofia_20260305.pdf','Knee CT scan with contrast'),
  (7,4,4,'2026-03-20','2026-03-20 08:45:00','bloodwork_martin_20260320.pdf','files\\estudios\\bloodwork_martin_20260320.pdf','Complete blood test with values in normal ranges'),
  (8,5,5,'2026-03-22','2026-03-22 18:25:00','pelvic_ultrasound_valentina_20260322.pdf','files\\estudios\\pelvic_ultrasound_valentina_20260322.pdf','Transvaginal pelvic ultrasound without alterations'),
  (9,5,5,'2026-03-08','2026-03-08 13:15:00','mammogram_valentina_20260308.pdf','files\\estudios\\mammogram_valentina_20260308.pdf','Bilateral mammogram BIRADS 1'),
  (10,6,2,'2026-03-15','2026-03-15 14:45:00','brain_ct_fernando_20260315.pdf','files\\estudios\\brain_ct_fernando_20260315.pdf','Non-contrast brain CT reported as normal'),
  (11,7,1,'2026-03-12','2026-03-12 09:00:00','holter_camila_20260312.pdf','files\\estudios\\holter_camila_20260312.pdf','24-hour Holter monitoring with sinus rhythm'),
  (12,8,3,'2026-03-25','2026-03-25 19:10:00','spine_xray_alejandro_20260325.jpg','files\\estudios\\spine_xray_alejandro_20260325.jpg','Lumbar spine X-ray showing mild scoliosis');


SET FOREIGN_KEY_CHECKS=1;
