-- Create database
CREATE DATABASE IF NOT EXISTS `primecaredb`;
USE `primecaredb`;

DROP TABLE IF EXISTS `transfer`;
DROP TABLE IF EXISTS `dispatch`;
DROP TABLE IF EXISTS `request`;
DROP TABLE IF EXISTS `preassign`;
DROP TABLE IF EXISTS `patient`;
DROP TABLE IF EXISTS `ambulance`;
DROP TABLE IF EXISTS `staff`;
DROP TABLE IF EXISTS `reference_location`;
DROP TABLE IF EXISTS `hospital`;

CREATE TABLE `hospital` (
  `hospital_id` INT NOT NULL AUTO_INCREMENT,
  `hospital_name` VARCHAR(50) NOT NULL,
  `city` ENUM('Quezon_City', 'Manila_City', 'Muntinlupa_City') NOT NULL,
  `street` VARCHAR(20) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`hospital_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `reference_location` (
  `ref_location_id` INT NOT NULL AUTO_INCREMENT,
  `hospital_id` INT NOT NULL,
  `city` ENUM('Quezon_City', 'Manila_City', 'Muntinlupa_City') NOT NULL,
  `street` VARCHAR(20) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ref_location_id`),
  KEY `fk_reflocation_hospital` (`hospital_id`),
  CONSTRAINT `fk_reflocation_hospital`
    FOREIGN KEY (`hospital_id`) REFERENCES hospital(`hospital_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `staff` (
  `staff_id` INT NOT NULL AUTO_INCREMENT,
  `hospital_id` INT NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `staff_role` ENUM('driver', 'emt', 'paramedic') NOT NULL,
  `license_no` VARCHAR(11) UNIQUE NOT NULL,
  `shift_schedule` ENUM('morning', 'night') NOT NULL,
  `staff_status` ENUM('available', 'in_transfer', 'off_duty') NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`staff_id`),
  KEY `fk_staff_hospital` (`hospital_id`),
  CONSTRAINT `fk_staff_hospital`
    FOREIGN KEY (`hospital_id`) REFERENCES hospital(`hospital_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `ambulance` (
  `ambulance_id` INT NOT NULL AUTO_INCREMENT,
  `hospital_id` INT NOT NULL,
  `ambulance_type` ENUM('type_1', 'type_2') NOT NULL,
  `ambulance_status` ENUM('available', 'on_trip') NOT NULL,
  `plate_no` VARCHAR(7) UNIQUE NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`ambulance_id`),
  KEY `fk_ambulance_hospital_id` (`hospital_id`),
  CONSTRAINT `fk_ambulance_hospital_id`
    FOREIGN KEY(`hospital_id`) REFERENCES hospital(hospital_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `patient` (
  `patient_id` INT NOT NULL AUTO_INCREMENT,
  `ref_location_id` INT NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `age` INT CHECK (`age` >= 0),
  `medical_condition` ENUM('cardiac', 'trauma', 'respiratory', 'neurological', 'other') NOT NULL,
  `priority_level` ENUM('critical', 'moderate', 'routine') NOT NULL,
  `contact_person` VARCHAR(50),
  `contact_number` CHAR(11) UNIQUE,
  `transfer_status` ENUM('waiting', 'in_transfer', 'transferred'),
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`patient_id`),
  KEY `fk_patient_location` (`ref_location_id`),
  CONSTRAINT `fk_patient_location` 
    FOREIGN KEY (`ref_location_id`) 
    REFERENCES reference_location(`ref_location_id`)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Transactions

CREATE TABLE `preassign` (
	`preassign_id` INT NOT NULL AUTO_INCREMENT,
    `staff_id` INT NOT NULL,
    `staff_role` ENUM('driver', 'emt', 'paramedic') NOT NULL, 
    `ambulance_id` INT NOT NULL,
    `assignment_status` ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
	`assigned_on` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_on` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`preassign_id`),
    FOREIGN KEY (`staff_id`) REFERENCES `staff`(`staff_id`),
    FOREIGN KEY (`ambulance_id`) REFERENCES `ambulance`(`ambulance_id`),
    UNIQUE KEY unique_ambulance_role (`ambulance_id`, `staff_role`), 
    UNIQUE KEY unique_staff_time (`staff_id`, `assigned_on`)  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `request` (
	`request_id` INT NOT NULL AUTO_INCREMENT,
	`patient_id` INT NOT NULL,
	`ref_location_id` INT NOT NULL,
    `hospital_id` INT NOT NULL,
	`priority_level` ENUM('critical', 'moderate', 'routine') NOT NULL,
    `request_status` ENUM('pending', 'accepted', 'cancelled') NOT NULL DEFAULT 'pending',
    `requested_on` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_on` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`request_id`),  
    FOREIGN KEY (`patient_id`) REFERENCES `patient`(`patient_id`),  
    FOREIGN KEY (`ref_location_id`) REFERENCES `reference_location`(`ref_location_id`) ON DELETE RESTRICT,
    FOREIGN KEY (`hospital_id`) REFERENCES `hospital`(`hospital_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `dispatch` (
	`dispatch_id` INT NOT NULL AUTO_INCREMENT,
	`request_id` INT NOT NULL,
	`ambulance_id` INT NOT NULL,
    `dispatched_on` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `dispatch_status` ENUM('pending', 'dispatched', 'cancelled') NOT NULL,
    `created_on` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`dispatch_id`),
    FOREIGN KEY (`request_id`) REFERENCES `request`(`request_id`),
    FOREIGN KEY (`ambulance_id`) REFERENCES `ambulance`(`ambulance_id`),
    UNIQUE KEY (`request_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `transfer` (
  `transfer_id` INT NOT NULL AUTO_INCREMENT,
  `patient_id` INT NOT NULL,
  `ambulance_id` INT NOT NULL,
  `staff_id` INT NOT NULL,
  `hospital_id` INT NOT NULL,
  `transferred_on` DATETIME NOT NULL,
  `transfer_status` ENUM('transferred') NOT NULL,
  `priority_level` ENUM('critical', 'moderate', 'routine'),
  `updated_on` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`transfer_id`),
  FOREIGN KEY (`patient_id`) REFERENCES patient(`patient_id`) ON DELETE CASCADE,
  FOREIGN KEY (`ambulance_id`) REFERENCES ambulance(`ambulance_id`) ON DELETE RESTRICT,
  FOREIGN KEY (`hospital_id`) REFERENCES hospital(`hospital_id`) ON DELETE RESTRICT,
  FOREIGN KEY (`staff_id`) REFERENCES staff(`staff_id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
