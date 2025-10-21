-- Sample data for Oracle schema
-- Run after schema_oracle.sql and stored_procs_oracle.sql

SET SERVEROUTPUT ON;

-- Roles
INSERT INTO role (role_id, name, description) VALUES (role_seq.NEXTVAL, 'ADMIN', 'System administrator');
INSERT INTO role (role_id, name, description) VALUES (role_seq.NEXTVAL, 'OWNER', 'Property owner');
INSERT INTO role (role_id, name, description) VALUES (role_seq.NEXTVAL, 'ASSESSOR', 'Municipal assessor');
INSERT INTO role (role_id, name, description) VALUES (role_seq.NEXTVAL, 'CASHIER', 'Tax collector');

-- Users
INSERT INTO user_account (user_id, username, password_hash, full_name, email, created_at)
VALUES (user_account_seq.NEXTVAL, 'admin', '$2y$10$placeholderhash', 'System Admin', 'admin@example.com', SYSTIMESTAMP);

INSERT INTO user_account (user_id, username, password_hash, full_name, email, created_at)
VALUES (user_account_seq.NEXTVAL, 'john_doe', '$2y$10$placeholderhash', 'John Doe', 'john@example.com', SYSTIMESTAMP);

-- Assign roles by lookup
INSERT INTO user_role (user_id, role_id, assigned_at)
SELECT ua.user_id, r.role_id, SYSTIMESTAMP FROM user_account ua, role r WHERE ua.username = 'admin' AND r.name = 'ADMIN';

INSERT INTO user_role (user_id, role_id, assigned_at)
SELECT ua.user_id, r.role_id, SYSTIMESTAMP FROM user_account ua, role r WHERE ua.username = 'john_doe' AND r.name = 'OWNER';

-- Owner
INSERT INTO owner (owner_id, user_id, full_name, contact_no, email, identity_proof, created_at)
VALUES (owner_seq.NEXTVAL, (SELECT user_id FROM user_account WHERE username = 'john_doe'), 'John Doe', '555-0100', 'john@example.com', 'DL-123456', SYSTIMESTAMP);

-- Wards
INSERT INTO ward (ward_id, name, area_description) VALUES (ward_seq.NEXTVAL, 'Ward 1', 'Central ward');
INSERT INTO ward (ward_id, name, area_description) VALUES (ward_seq.NEXTVAL, 'Ward 2', 'North ward');

-- Property types
INSERT INTO property_type (ptype_id, name, description) VALUES (property_type_seq.NEXTVAL, 'Residential', 'Residential property');
INSERT INTO property_type (ptype_id, name, description) VALUES (property_type_seq.NEXTVAL, 'Commercial', 'Commercial property');

-- Properties (lookup related ids)
INSERT INTO property (property_id, owner_id, ward_id, ptype_id, address, land_area, built_area, usage, created_at)
VALUES (
  property_seq.NEXTVAL,
  (SELECT owner_id FROM owner WHERE full_name = 'John Doe'),
  (SELECT ward_id FROM ward WHERE name = 'Ward 1'),
  (SELECT ptype_id FROM property_type WHERE name = 'Residential'),
  '123 Main St, Apt 4', 200.00, 120.00, 'Residential', SYSTIMESTAMP
);

INSERT INTO property (property_id, owner_id, ward_id, ptype_id, address, land_area, built_area, usage, created_at)
VALUES (
  property_seq.NEXTVAL,
  (SELECT owner_id FROM owner WHERE full_name = 'John Doe'),
  (SELECT ward_id FROM ward WHERE name = 'Ward 2'),
  (SELECT ptype_id FROM property_type WHERE name = 'Commercial'),
  '45 Market Rd', 500.00, 350.00, 'Commercial', SYSTIMESTAMP
);

-- Tax slabs
INSERT INTO tax_slab (slab_id, ptype_id, min_area, max_area, base_rate_per_sq_m, effective_from, effective_to, active, created_at)
VALUES (tax_slab_seq.NEXTVAL, (SELECT ptype_id FROM property_type WHERE name='Residential'), 0, 150, 10.00, DATE '2025-04-01', NULL, 1, SYSTIMESTAMP);

INSERT INTO tax_slab (slab_id, ptype_id, min_area, max_area, base_rate_per_sq_m, effective_from, effective_to, active, created_at)
VALUES (tax_slab_seq.NEXTVAL, (SELECT ptype_id FROM property_type WHERE name='Residential'), 150.01, 1000, 8.50, DATE '2025-04-01', NULL, 1, SYSTIMESTAMP);

INSERT INTO tax_slab (slab_id, ptype_id, min_area, max_area, base_rate_per_sq_m, effective_from, effective_to, active, created_at)
VALUES (tax_slab_seq.NEXTVAL, (SELECT ptype_id FROM property_type WHERE name='Commercial'), 0, 1000, 15.00, DATE '2025-04-01', NULL, 1, SYSTIMESTAMP);

-- Assessments (manual computation)
INSERT INTO assessment (assess_id, property_id, financial_year, assessed_value, base_tax, total_due, created_at)
VALUES (assessment_seq.NEXTVAL, (SELECT property_id FROM property WHERE address LIKE '%123 Main St%'), '2025-2026', 120.00 * 10.00, 120.00 * 10.00, 120.00 * 10.00, SYSTIMESTAMP);

INSERT INTO assessment (assess_id, property_id, financial_year, assessed_value, base_tax, total_due, created_at)
VALUES (assessment_seq.NEXTVAL, (SELECT property_id FROM property WHERE address LIKE '%Market Rd%'), '2025-2026', 350.00 * 15.00, 350.00 * 15.00, 350.00 * 15.00, SYSTIMESTAMP);

-- Sample payment and receipt
INSERT INTO payment (payment_id, assess_id, paid_amount, payment_method, transaction_ref, payment_status, paid_on)
VALUES (payment_seq.NEXTVAL, (SELECT assess_id FROM assessment WHERE property_id = (SELECT property_id FROM property WHERE address LIKE '%123 Main St%') AND financial_year='2025-2026'), 600.00, 'CARD', 'TX-1234', 'SUCCESS', SYSTIMESTAMP);

-- create receipt using CURRVAL of payment_seq (same session)
INSERT INTO receipt (receipt_id, payment_id, receipt_no, generated_on)
VALUES (receipt_seq.NEXTVAL, payment_seq.CURRVAL, 'R-'||TO_CHAR(SYSTIMESTAMP,'YYYYMMDDHH24MISS')||'-'||TO_CHAR(payment_seq.CURRVAL), SYSTIMESTAMP);

COMMIT;
