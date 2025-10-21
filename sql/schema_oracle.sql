-- Oracle DDL for Online Property Tax Management System
-- Uses sequences and triggers to simulate auto-increment behavior

-- Note: Run these statements as a DBA or a user with CREATE TABLE, SEQUENCE, TRIGGER privileges.

-- ROLE
CREATE TABLE role (
  role_id NUMBER PRIMARY KEY,
  name VARCHAR2(50) NOT NULL,
  description VARCHAR2(255)
);
CREATE UNIQUE INDEX uq_role_name ON role(name);
CREATE SEQUENCE role_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE OR REPLACE TRIGGER trg_role_bi BEFORE INSERT ON role
FOR EACH ROW WHEN (NEW.role_id IS NULL)
BEGIN
  SELECT role_seq.NEXTVAL INTO :NEW.role_id FROM dual;
END;

-- USER_ACCOUNT
CREATE TABLE user_account (
  user_id NUMBER PRIMARY KEY,
  username VARCHAR2(100) NOT NULL,
  password_hash VARCHAR2(255) NOT NULL,
  full_name VARCHAR2(200),
  email VARCHAR2(150),
  phone VARCHAR2(30),
  status VARCHAR2(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT SYSTIMESTAMP
);
CREATE UNIQUE INDEX uq_user_username ON user_account(username);
CREATE UNIQUE INDEX uq_user_email ON user_account(email);
CREATE SEQUENCE user_account_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE OR REPLACE TRIGGER trg_user_account_bi BEFORE INSERT ON user_account
FOR EACH ROW WHEN (NEW.user_id IS NULL)
BEGIN
  SELECT user_account_seq.NEXTVAL INTO :NEW.user_id FROM dual;
END;

-- USER_ROLE
CREATE TABLE user_role (
  user_id NUMBER NOT NULL,
  role_id NUMBER NOT NULL,
  assigned_at TIMESTAMP DEFAULT SYSTIMESTAMP,
  CONSTRAINT pk_user_role PRIMARY KEY (user_id, role_id),
  CONSTRAINT fk_userrole_user FOREIGN KEY (user_id) REFERENCES user_account(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_userrole_role FOREIGN KEY (role_id) REFERENCES role(role_id) ON DELETE RESTRICT
);

-- OWNER
CREATE TABLE owner (
  owner_id NUMBER PRIMARY KEY,
  user_id NUMBER,
  full_name VARCHAR2(200) NOT NULL,
  contact_no VARCHAR2(50),
  email VARCHAR2(150),
  identity_proof VARCHAR2(255),
  created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
  CONSTRAINT fk_owner_user FOREIGN KEY (user_id) REFERENCES user_account(user_id) ON DELETE SET NULL
);
CREATE SEQUENCE owner_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE OR REPLACE TRIGGER trg_owner_bi BEFORE INSERT ON owner
FOR EACH ROW WHEN (NEW.owner_id IS NULL)
BEGIN
  SELECT owner_seq.NEXTVAL INTO :NEW.owner_id FROM dual;
END;

-- WARD
CREATE TABLE ward (
  ward_id NUMBER PRIMARY KEY,
  name VARCHAR2(150) NOT NULL,
  area_description CLOB
);
CREATE SEQUENCE ward_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE OR REPLACE TRIGGER trg_ward_bi BEFORE INSERT ON ward
FOR EACH ROW WHEN (NEW.ward_id IS NULL)
BEGIN
  SELECT ward_seq.NEXTVAL INTO :NEW.ward_id FROM dual;
END;

-- PROPERTY_TYPE
CREATE TABLE property_type (
  ptype_id NUMBER PRIMARY KEY,
  name VARCHAR2(100) NOT NULL,
  description VARCHAR2(255)
);
CREATE UNIQUE INDEX uq_ptype_name ON property_type(name);
CREATE SEQUENCE property_type_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE OR REPLACE TRIGGER trg_ptype_bi BEFORE INSERT ON property_type
FOR EACH ROW WHEN (NEW.ptype_id IS NULL)
BEGIN
  SELECT property_type_seq.NEXTVAL INTO :NEW.ptype_id FROM dual;
END;

-- PROPERTY
CREATE TABLE property (
  property_id NUMBER PRIMARY KEY,
  owner_id NUMBER NOT NULL,
  ward_id NUMBER NOT NULL,
  ptype_id NUMBER NOT NULL,
  address CLOB NOT NULL,
  land_area NUMBER(10,2) DEFAULT 0,
  built_area NUMBER(10,2) DEFAULT 0,
  usage VARCHAR2(100),
  created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
  CONSTRAINT fk_property_owner FOREIGN KEY (owner_id) REFERENCES owner(owner_id) ON DELETE RESTRICT,
  CONSTRAINT fk_property_ward FOREIGN KEY (ward_id) REFERENCES ward(ward_id) ON DELETE RESTRICT,
  CONSTRAINT fk_property_ptype FOREIGN KEY (ptype_id) REFERENCES property_type(ptype_id) ON DELETE RESTRICT
);
CREATE INDEX idx_property_owner ON property(owner_id);
CREATE INDEX idx_property_ward ON property(ward_id);
CREATE SEQUENCE property_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE OR REPLACE TRIGGER trg_property_bi BEFORE INSERT ON property
FOR EACH ROW WHEN (NEW.property_id IS NULL)
BEGIN
  SELECT property_seq.NEXTVAL INTO :NEW.property_id FROM dual;
END;

-- TAX_SLAB
CREATE TABLE tax_slab (
  slab_id NUMBER PRIMARY KEY,
  ptype_id NUMBER,
  min_area NUMBER(10,2) NOT NULL,
  max_area NUMBER(10,2) NOT NULL,
  base_rate_per_sq_m NUMBER(12,4) NOT NULL,
  effective_from DATE NOT NULL,
  effective_to DATE,
  active NUMBER(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
  CONSTRAINT fk_taxslab_ptype FOREIGN KEY (ptype_id) REFERENCES property_type(ptype_id)
);
CREATE SEQUENCE tax_slab_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE OR REPLACE TRIGGER trg_tax_slab_bi BEFORE INSERT ON tax_slab
FOR EACH ROW WHEN (NEW.slab_id IS NULL)
BEGIN
  SELECT tax_slab_seq.NEXTVAL INTO :NEW.slab_id FROM dual;
END;

-- EXEMPTION
CREATE TABLE exemption (
  exemp_id NUMBER PRIMARY KEY,
  name VARCHAR2(150) NOT NULL,
  percentage NUMBER(5,2) DEFAULT 0,
  valid_from DATE,
  valid_to DATE,
  active NUMBER(1) DEFAULT 1
);
CREATE SEQUENCE exemption_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE OR REPLACE TRIGGER trg_exemption_bi BEFORE INSERT ON exemption
FOR EACH ROW WHEN (NEW.exemp_id IS NULL)
BEGIN
  SELECT exemption_seq.NEXTVAL INTO :NEW.exemp_id FROM dual;
END;

-- ASSESSMENT
CREATE TABLE assessment (
  assess_id NUMBER PRIMARY KEY,
  property_id NUMBER NOT NULL,
  financial_year VARCHAR2(9) NOT NULL,
  assessed_value NUMBER(14,2) NOT NULL,
  base_tax NUMBER(12,2) NOT NULL,
  exemption_id NUMBER,
  penalty NUMBER(12,2) DEFAULT 0,
  total_due NUMBER(12,2) NOT NULL,
  status VARCHAR2(20) DEFAULT 'DUE',
  created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
  CONSTRAINT fk_assessment_property FOREIGN KEY (property_id) REFERENCES property(property_id),
  CONSTRAINT fk_assessment_exemption FOREIGN KEY (exemption_id) REFERENCES exemption(exemp_id)
);
CREATE UNIQUE INDEX uq_assessment_property_year ON assessment(property_id, financial_year);
CREATE SEQUENCE assessment_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE OR REPLACE TRIGGER trg_assessment_bi BEFORE INSERT ON assessment
FOR EACH ROW WHEN (NEW.assess_id IS NULL)
BEGIN
  SELECT assessment_seq.NEXTVAL INTO :NEW.assess_id FROM dual;
END;

-- PAYMENT
CREATE TABLE payment (
  payment_id NUMBER PRIMARY KEY,
  assess_id NUMBER NOT NULL,
  paid_amount NUMBER(12,2) NOT NULL,
  paid_on TIMESTAMP DEFAULT SYSTIMESTAMP,
  payment_method VARCHAR2(50),
  transaction_ref VARCHAR2(200),
  payment_status VARCHAR2(20) DEFAULT 'INITIATED',
  CONSTRAINT fk_payment_assess FOREIGN KEY (assess_id) REFERENCES assessment(assess_id)
);
CREATE SEQUENCE payment_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE OR REPLACE TRIGGER trg_payment_bi BEFORE INSERT ON payment
FOR EACH ROW WHEN (NEW.payment_id IS NULL)
BEGIN
  SELECT payment_seq.NEXTVAL INTO :NEW.payment_id FROM dual;
END;

-- RECEIPT
CREATE TABLE receipt (
  receipt_id NUMBER PRIMARY KEY,
  payment_id NUMBER NOT NULL,
  receipt_no VARCHAR2(100) NOT NULL,
  generated_on TIMESTAMP DEFAULT SYSTIMESTAMP,
  CONSTRAINT fk_receipt_payment FOREIGN KEY (payment_id) REFERENCES payment(payment_id),
  CONSTRAINT uq_receipt_payment UNIQUE (payment_id),
  CONSTRAINT uq_receipt_no UNIQUE (receipt_no)
);
CREATE SEQUENCE receipt_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE OR REPLACE TRIGGER trg_receipt_bi BEFORE INSERT ON receipt
FOR EACH ROW WHEN (NEW.receipt_id IS NULL)
BEGIN
  SELECT receipt_seq.NEXTVAL INTO :NEW.receipt_id FROM dual;
END;

-- AUDIT_LOG
CREATE TABLE audit_log (
  log_id NUMBER PRIMARY KEY,
  user_id NUMBER,
  action VARCHAR2(100) NOT NULL,
  table_name VARCHAR2(100),
  record_id VARCHAR2(100),
  description CLOB,
  created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
  CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES user_account(user_id)
);
CREATE SEQUENCE audit_log_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE OR REPLACE TRIGGER trg_audit_log_bi BEFORE INSERT ON audit_log
FOR EACH ROW WHEN (NEW.log_id IS NULL)
BEGIN
  SELECT audit_log_seq.NEXTVAL INTO :NEW.log_id FROM dual;
END;

-- Simple view
CREATE OR REPLACE VIEW vw_outstanding_by_ward AS
SELECT w.ward_id, w.name AS ward_name, COUNT(a.assess_id) AS outstanding_assessments, SUM(a.total_due) AS total_due
FROM assessment a
JOIN property p ON a.property_id = p.property_id
JOIN ward w ON p.ward_id = w.ward_id
WHERE a.total_due > 0
GROUP BY w.ward_id, w.name;
