-- MySQL stored procedures and triggers
DELIMITER $$

DROP PROCEDURE IF EXISTS sp_generate_assessment$$
CREATE PROCEDURE sp_generate_assessment(
  IN p_property_id INT,
  IN p_fin_year VARCHAR(9),
  OUT p_assess_id INT
)
BEGIN
  DECLARE v_built_area DECIMAL(10,2);
  DECLARE v_ptype INT;
  DECLARE v_rate DECIMAL(12,4);
  DECLARE v_assessed_value DECIMAL(14,2);
  DECLARE v_base_tax DECIMAL(12,2);

  SELECT built_area, ptype_id INTO v_built_area, v_ptype FROM property WHERE property_id = p_property_id;

  SELECT base_rate_per_sq_m INTO v_rate
  FROM tax_slab
  WHERE (ptype_id = v_ptype OR ptype_id IS NULL)
    AND min_area <= v_built_area AND max_area >= v_built_area
    AND active = TRUE
  ORDER BY ptype_id DESC LIMIT 1;

  SET v_assessed_value = v_built_area * v_rate;
  SET v_base_tax = v_assessed_value;

  INSERT INTO assessment(property_id, financial_year, assessed_value, base_tax, total_due)
  VALUES (p_property_id, p_fin_year, v_assessed_value, v_base_tax, v_base_tax);

  SET p_assess_id = LAST_INSERT_ID();
END$$

DROP PROCEDURE IF EXISTS sp_apply_payment$$
CREATE PROCEDURE sp_apply_payment(
  IN p_assess_id INT,
  IN p_amount DECIMAL(12,2),
  IN p_method VARCHAR(50),
  IN p_txref VARCHAR(200),
  OUT p_payment_id INT
)
BEGIN
  DECLARE v_total_due DECIMAL(12,2);
  DECLARE v_new_due DECIMAL(12,2);

  SELECT total_due INTO v_total_due FROM assessment WHERE assess_id = p_assess_id FOR UPDATE;

  IF v_total_due IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Assessment not found';
  END IF;

  INSERT INTO payment(assess_id, paid_amount, payment_method, transaction_ref, payment_status)
  VALUES (p_assess_id, p_amount, p_method, p_txref, 'SUCCESS');

  SET p_payment_id = LAST_INSERT_ID();

  SET v_new_due = v_total_due - p_amount;

  UPDATE assessment
  SET total_due = GREATEST(0, v_new_due),
      status = CASE WHEN GREATEST(0, v_new_due) = 0 THEN 'PAID' WHEN GREATEST(0, v_new_due) < v_total_due THEN 'PARTIAL' ELSE 'DUE' END
  WHERE assess_id = p_assess_id;

  INSERT INTO receipt(payment_id, receipt_no)
  VALUES (p_payment_id, CONCAT('R-', DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'), '-', p_payment_id));

END$$

-- Trigger to create receipt for payments inserted outside the procedure
DROP TRIGGER IF EXISTS trg_after_payment_insert$$
CREATE TRIGGER trg_after_payment_insert
AFTER INSERT ON payment
FOR EACH ROW
BEGIN
  DECLARE v_exists INT;

  SELECT COUNT(*) INTO v_exists FROM receipt WHERE payment_id = NEW.payment_id;

  IF v_exists = 0 THEN
    INSERT INTO receipt(payment_id, receipt_no)
    VALUES (NEW.payment_id, CONCAT('R-', DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'), '-', NEW.payment_id));

    UPDATE assessment
    SET total_due = GREATEST(0, total_due - NEW.paid_amount),
        status = CASE WHEN GREATEST(0, total_due - NEW.paid_amount) = 0 THEN 'PAID' WHEN GREATEST(0, total_due - NEW.paid_amount) < total_due THEN 'PARTIAL' ELSE 'DUE' END
    WHERE assess_id = NEW.assess_id;
  END IF;
END$$

DELIMITER ;
