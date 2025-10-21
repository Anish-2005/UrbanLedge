-- MySQL DDL for Online Property Tax Management System (commercial-ready)
-- Adds stricter constraints, indexes and comments suitable for MySQL/Oracle migration

SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS role (
  role_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_account (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(200),
  email VARCHAR(150) UNIQUE,
  phone VARCHAR(30),
  status ENUM('ACTIVE','INACTIVE','SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_role (
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, role_id),
  CONSTRAINT fk_userrole_user FOREIGN KEY (user_id) REFERENCES user_account(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_userrole_role FOREIGN KEY (role_id) REFERENCES role(role_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS owner (
  owner_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT DEFAULT NULL,
  full_name VARCHAR(200) NOT NULL,
  contact_no VARCHAR(50),
  email VARCHAR(150),
  identity_proof VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_owner_user FOREIGN KEY (user_id) REFERENCES user_account(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS ward (
  ward_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  area_description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS property_type (
  ptype_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS property (
  property_id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT NOT NULL,
  ward_id INT NOT NULL,
  ptype_id INT NOT NULL,
  address TEXT NOT NULL,
  land_area DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  built_area DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  usage VARCHAR(100),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_property_owner FOREIGN KEY (owner_id) REFERENCES owner(owner_id) ON DELETE RESTRICT,
  CONSTRAINT fk_property_ward FOREIGN KEY (ward_id) REFERENCES ward(ward_id) ON DELETE RESTRICT,
  CONSTRAINT fk_property_ptype FOREIGN KEY (ptype_id) REFERENCES property_type(ptype_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_property_owner ON property(owner_id);
CREATE INDEX idx_property_ward ON property(ward_id);

CREATE TABLE IF NOT EXISTS tax_slab (
  slab_id INT AUTO_INCREMENT PRIMARY KEY,
  ptype_id INT DEFAULT NULL,
  min_area DECIMAL(10,2) NOT NULL,
  max_area DECIMAL(10,2) NOT NULL,
  base_rate_per_sq_m DECIMAL(12,4) NOT NULL,
  effective_from DATE NOT NULL,
  effective_to DATE DEFAULT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_taxslab_ptype FOREIGN KEY (ptype_id) REFERENCES property_type(ptype_id) ON DELETE SET NULL,
  CONSTRAINT chk_taxslab_area CHECK (min_area >= 0 AND max_area >= min_area)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS exemption (
  exemp_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  valid_from DATE,
  valid_to DATE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT chk_exemption_pct CHECK (percentage >= 0 AND percentage <= 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS assessment (
  assess_id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  financial_year VARCHAR(9) NOT NULL,
  assessed_value DECIMAL(14,2) NOT NULL,
  base_tax DECIMAL(12,2) NOT NULL,
  exemption_id INT DEFAULT NULL,
  penalty DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  total_due DECIMAL(12,2) NOT NULL,
  status ENUM('DUE','PAID','PARTIAL','WRITTEN_OFF') NOT NULL DEFAULT 'DUE',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_assessment_property FOREIGN KEY (property_id) REFERENCES property(property_id) ON DELETE CASCADE,
  CONSTRAINT fk_assessment_exemption FOREIGN KEY (exemption_id) REFERENCES exemption(exemp_id) ON DELETE SET NULL,
  UNIQUE KEY uq_property_year (property_id, financial_year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_assessment_property ON assessment(property_id);

CREATE TABLE IF NOT EXISTS payment (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  assess_id INT NOT NULL,
  paid_amount DECIMAL(12,2) NOT NULL,
  paid_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  payment_method VARCHAR(50),
  transaction_ref VARCHAR(200),
  payment_status ENUM('INITIATED','SUCCESS','FAILED') NOT NULL DEFAULT 'INITIATED',
  CONSTRAINT fk_payment_assess FOREIGN KEY (assess_id) REFERENCES assessment(assess_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_payment_assess ON payment(assess_id);

CREATE TABLE IF NOT EXISTS receipt (
  receipt_id INT AUTO_INCREMENT PRIMARY KEY,
  payment_id INT NOT NULL UNIQUE,
  receipt_no VARCHAR(100) NOT NULL UNIQUE,
  generated_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_receipt_payment FOREIGN KEY (payment_id) REFERENCES payment(payment_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS audit_log (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(100),
  record_id VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES user_account(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- helpful views
CREATE OR REPLACE VIEW vw_outstanding_by_ward AS
SELECT w.ward_id, w.name AS ward_name, COUNT(a.assess_id) AS outstanding_assessments, SUM(a.total_due) AS total_due
FROM assessment a
JOIN property p ON a.property_id = p.property_id
JOIN ward w ON p.ward_id = w.ward_id
WHERE a.total_due > 0
GROUP BY w.ward_id, w.name;

SET FOREIGN_KEY_CHECKS = 1;
