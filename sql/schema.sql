-- SQL DDL for Online Property Tax Management System (MySQL)

SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE role (
  role_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE user_account (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(200),
  email VARCHAR(150) UNIQUE,
  phone VARCHAR(30),
  status ENUM('ACTIVE','INACTIVE','SUSPENDED') DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE user_role (
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES user_account(user_id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES role(role_id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE owner (
  owner_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT DEFAULT NULL,
  full_name VARCHAR(200) NOT NULL,
  contact_no VARCHAR(50),
  email VARCHAR(150),
  identity_proof VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_account(user_id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE ward (
  ward_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  area_description TEXT
) ENGINE=InnoDB;

CREATE TABLE property_type (
  ptype_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE property (
  property_id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT NOT NULL,
  ward_id INT NOT NULL,
  ptype_id INT NOT NULL,
  address TEXT NOT NULL,
  land_area DECIMAL(10,2) DEFAULT 0,
  built_area DECIMAL(10,2) DEFAULT 0,
  usage VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES owner(owner_id) ON DELETE RESTRICT,
  FOREIGN KEY (ward_id) REFERENCES ward(ward_id) ON DELETE RESTRICT,
  FOREIGN KEY (ptype_id) REFERENCES property_type(ptype_id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE tax_slab (
  slab_id INT AUTO_INCREMENT PRIMARY KEY,
  ptype_id INT DEFAULT NULL,
  min_area DECIMAL(10,2) NOT NULL,
  max_area DECIMAL(10,2) NOT NULL,
  base_rate_per_sq_m DECIMAL(12,4) NOT NULL,
  effective_from DATE NOT NULL,
  effective_to DATE DEFAULT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ptype_id) REFERENCES property_type(ptype_id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE exemption (
  exemp_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  percentage DECIMAL(5,2) DEFAULT 0,
  valid_from DATE,
  valid_to DATE,
  active BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB;

CREATE TABLE assessment (
  assess_id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  financial_year VARCHAR(9) NOT NULL,
  assessed_value DECIMAL(14,2) NOT NULL,
  base_tax DECIMAL(12,2) NOT NULL,
  exemption_id INT DEFAULT NULL,
  penalty DECIMAL(12,2) DEFAULT 0,
  total_due DECIMAL(12,2) NOT NULL,
  status ENUM('DUE','PAID','PARTIAL','WRITTEN_OFF') DEFAULT 'DUE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES property(property_id) ON DELETE CASCADE,
  FOREIGN KEY (exemption_id) REFERENCES exemption(exemp_id) ON DELETE SET NULL,
  UNIQUE (property_id, financial_year)
) ENGINE=InnoDB;

CREATE TABLE payment (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  assess_id INT NOT NULL,
  paid_amount DECIMAL(12,2) NOT NULL,
  paid_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  payment_method VARCHAR(50),
  transaction_ref VARCHAR(200),
  payment_status ENUM('INITIATED','SUCCESS','FAILED') DEFAULT 'INITIATED',
  FOREIGN KEY (assess_id) REFERENCES assessment(assess_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE receipt (
  receipt_id INT AUTO_INCREMENT PRIMARY KEY,
  payment_id INT NOT NULL UNIQUE,
  receipt_no VARCHAR(100) NOT NULL UNIQUE,
  generated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (payment_id) REFERENCES payment(payment_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE audit_log (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(100),
  record_id VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_account(user_id) ON DELETE SET NULL
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;
