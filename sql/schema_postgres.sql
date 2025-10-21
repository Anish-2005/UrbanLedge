-- PostgreSQL DDL for Online Property Tax Management System

CREATE TABLE IF NOT EXISTS role (
  role_id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS user_account (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(200),
  email VARCHAR(150) UNIQUE,
  phone VARCHAR(30),
  status VARCHAR(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_role (
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES user_account(user_id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES role(role_id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS owner (
  owner_id SERIAL PRIMARY KEY,
  user_id INT DEFAULT NULL,
  full_name VARCHAR(200) NOT NULL,
  contact_no VARCHAR(50),
  email VARCHAR(150),
  identity_proof VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES user_account(user_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS ward (
  ward_id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  area_description TEXT
);

CREATE TABLE IF NOT EXISTS property_type (
  ptype_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS property (
  property_id SERIAL PRIMARY KEY,
  owner_id INT NOT NULL,
  ward_id INT NOT NULL,
  ptype_id INT NOT NULL,
  address TEXT NOT NULL,
  land_area NUMERIC(10,2) DEFAULT 0,
  built_area NUMERIC(10,2) DEFAULT 0,
  usage VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  FOREIGN KEY (owner_id) REFERENCES owner(owner_id) ON DELETE RESTRICT,
  FOREIGN KEY (ward_id) REFERENCES ward(ward_id) ON DELETE RESTRICT,
  FOREIGN KEY (ptype_id) REFERENCES property_type(ptype_id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS tax_slab (
  slab_id SERIAL PRIMARY KEY,
  ptype_id INT DEFAULT NULL,
  min_area NUMERIC(10,2) NOT NULL,
  max_area NUMERIC(10,2) NOT NULL,
  base_rate_per_sq_m NUMERIC(12,4) NOT NULL,
  effective_from DATE NOT NULL,
  effective_to DATE DEFAULT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  FOREIGN KEY (ptype_id) REFERENCES property_type(ptype_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS exemption (
  exemp_id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  percentage NUMERIC(5,2) DEFAULT 0,
  valid_from DATE,
  valid_to DATE,
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS assessment (
  assess_id SERIAL PRIMARY KEY,
  property_id INT NOT NULL,
  financial_year VARCHAR(9) NOT NULL,
  assessed_value NUMERIC(14,2) NOT NULL,
  base_tax NUMERIC(12,2) NOT NULL,
  exemption_id INT DEFAULT NULL,
  penalty NUMERIC(12,2) DEFAULT 0,
  total_due NUMERIC(12,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'DUE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  FOREIGN KEY (property_id) REFERENCES property(property_id) ON DELETE CASCADE,
  FOREIGN KEY (exemption_id) REFERENCES exemption(exemp_id) ON DELETE SET NULL,
  UNIQUE (property_id, financial_year)
);

CREATE TABLE IF NOT EXISTS payment (
  payment_id SERIAL PRIMARY KEY,
  assess_id INT NOT NULL,
  paid_amount NUMERIC(12,2) NOT NULL,
  paid_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  payment_method VARCHAR(50),
  transaction_ref VARCHAR(200),
  payment_status VARCHAR(20) DEFAULT 'INITIATED',
  FOREIGN KEY (assess_id) REFERENCES assessment(assess_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS receipt (
  receipt_id SERIAL PRIMARY KEY,
  payment_id INT NOT NULL UNIQUE,
  receipt_no VARCHAR(100) NOT NULL UNIQUE,
  generated_on TIMESTAMP WITH TIME ZONE DEFAULT now(),
  FOREIGN KEY (payment_id) REFERENCES payment(payment_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_log (
  log_id SERIAL PRIMARY KEY,
  user_id INT,
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(100),
  record_id VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES user_account(user_id) ON DELETE SET NULL
);
