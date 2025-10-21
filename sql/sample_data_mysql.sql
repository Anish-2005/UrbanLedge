-- Sample data for MySQL schema
SET FOREIGN_KEY_CHECKS = 0;

INSERT INTO role (name, description) VALUES
('ADMIN','System administrator'),
('OWNER','Property owner'),
('ASSESSOR','Municipal assessor'),
('CASHIER','Tax collector');

INSERT INTO user_account (username, password_hash, full_name, email) VALUES
('admin', '$2y$10$placeholderhash', 'System Admin', 'admin@example.com'),
('john_doe', '$2y$10$placeholderhash', 'John Doe', 'john@example.com');

INSERT INTO user_role (user_id, role_id) VALUES
(1,1),(2,2);

INSERT INTO owner (user_id, full_name, contact_no, email, identity_proof) VALUES
(2, 'John Doe', '555-0100', 'john@example.com', 'DL-123456');

INSERT INTO ward (name, area_description) VALUES
('Ward 1','Central ward'),
('Ward 2','North ward');

INSERT INTO property_type (name, description) VALUES
('Residential','Residential property'),
('Commercial','Commercial property');

INSERT INTO property (owner_id, ward_id, ptype_id, address, land_area, built_area, usage) VALUES
(1, 1, 1, '123 Main St, Apt 4', 200.00, 120.00, 'Residential'),
(1, 2, 2, '45 Market Rd', 500.00, 350.00, 'Commercial');

INSERT INTO tax_slab (ptype_id, min_area, max_area, base_rate_per_sq_m, effective_from, effective_to) VALUES
(1, 0, 150, 10.00, '2025-04-01', NULL),
(1, 150.01, 1000, 8.50, '2025-04-01', NULL),
(2, 0, 1000, 15.00, '2025-04-01', NULL);

-- Manual assessments for sample properties
INSERT INTO assessment (property_id, financial_year, assessed_value, base_tax, total_due)
VALUES (1, '2025-2026', 120.00 * 10.00, 120.00 * 10.00, 120.00 * 10.00);

INSERT INTO assessment (property_id, financial_year, assessed_value, base_tax, total_due)
VALUES (2, '2025-2026', 350.00 * 15.00, 350.00 * 15.00, 350.00 * 15.00);

-- Sample payment
INSERT INTO payment (assess_id, paid_amount, payment_method, transaction_ref, payment_status)
VALUES (1, 600.00, 'CARD', 'TX-1234', 'SUCCESS');

-- Create receipts manually for compatibility
INSERT INTO receipt (payment_id, receipt_no) VALUES (1, CONCAT('R-', DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'), '-1'));

SET FOREIGN_KEY_CHECKS = 1;
