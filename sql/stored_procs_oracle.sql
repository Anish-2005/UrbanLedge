-- Oracle PL/SQL equivalents for assessment/payment logic
-- Note: This uses autonomous transactions for receipt creation where helpful. Adjust privileges as required.

/* Ensure required sequences exist before compiling procedures. This block is safe to run multiple times. */
DECLARE
  v_cnt INTEGER;
  PROCEDURE ensure_seq(p_name VARCHAR2) IS
    v_local_cnt INTEGER;
  BEGIN
    SELECT COUNT(*) INTO v_local_cnt FROM user_sequences WHERE sequence_name = UPPER(p_name);
    IF v_local_cnt = 0 THEN
      EXECUTE IMMEDIATE 'CREATE SEQUENCE ' || p_name || ' START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE';
      BEGIN
        DBMS_OUTPUT.PUT_LINE('Created sequence: ' || p_name);
      EXCEPTION WHEN OTHERS THEN NULL;
      END;
    END IF;
  EXCEPTION
    WHEN OTHERS THEN
      NULL; -- ignore errors here; sequence creation may require privileges
  END;
BEGIN
  ensure_seq('role_seq');
  ensure_seq('user_account_seq');
  ensure_seq('owner_seq');
  ensure_seq('ward_seq');
  ensure_seq('property_type_seq');
  ensure_seq('property_seq');
  ensure_seq('tax_slab_seq');
  ensure_seq('exemption_seq');
  ensure_seq('assessment_seq');
  ensure_seq('payment_seq');
  ensure_seq('receipt_seq');
  ensure_seq('audit_log_seq');
EXCEPTION
  WHEN OTHERS THEN
    NULL; -- best-effort; if this fails, sequences may need to be created by the DBA
END;
/


CREATE OR REPLACE PROCEDURE sp_generate_assessment(
  p_property_id IN NUMBER,
  p_fin_year IN VARCHAR2,
  p_assess_id OUT NUMBER
)
AS
  v_built_area NUMBER(10,2);
  v_ptype NUMBER;
  v_rate NUMBER(12,4);
  v_assessed_value NUMBER(14,2);
  v_base_tax NUMBER(12,2);
BEGIN
  SELECT built_area, ptype_id INTO v_built_area, v_ptype FROM property WHERE property_id = p_property_id;

  SELECT base_rate_per_sq_m INTO v_rate
  FROM (
    SELECT base_rate_per_sq_m FROM tax_slab
    WHERE (ptype_id = v_ptype OR ptype_id IS NULL)
      AND min_area <= v_built_area AND max_area >= v_built_area
      AND active = 1
    ORDER BY CASE WHEN ptype_id IS NULL THEN 0 ELSE 1 END DESC
  ) WHERE ROWNUM = 1;

  v_assessed_value := v_built_area * v_rate;
  v_base_tax := v_assessed_value;

  INSERT INTO assessment(assess_id, property_id, financial_year, assessed_value, base_tax, total_due)
  VALUES (assessment_seq.NEXTVAL, p_property_id, p_fin_year, v_assessed_value, v_base_tax, v_base_tax)
  RETURNING assess_id INTO p_assess_id;

  COMMIT;
EXCEPTION
  WHEN NO_DATA_FOUND THEN
    RAISE_APPLICATION_ERROR(-20001, 'No slab or property found');
END;
/

CREATE OR REPLACE PROCEDURE sp_apply_payment(
  p_assess_id IN NUMBER,
  p_amount IN NUMBER,
  p_method IN VARCHAR2,
  p_txref IN VARCHAR2,
  p_payment_id OUT NUMBER
)
AS
  PRAGMA AUTONOMOUS_TRANSACTION;
  v_total_due NUMBER(12,2);
  v_new_due NUMBER(12,2);
BEGIN
  SELECT total_due INTO v_total_due FROM assessment WHERE assess_id = p_assess_id FOR UPDATE;

  IF v_total_due IS NULL THEN
    RAISE_APPLICATION_ERROR(-20002, 'Assessment not found');
  END IF;

  INSERT INTO payment(payment_id, assess_id, paid_amount, payment_method, transaction_ref, payment_status)
  VALUES (payment_seq.NEXTVAL, p_assess_id, p_amount, p_method, p_txref, 'SUCCESS')
  RETURNING payment_id INTO p_payment_id;

  v_new_due := v_total_due - p_amount;

  UPDATE assessment
  SET total_due = CASE WHEN v_new_due < 0 THEN 0 ELSE v_new_due END,
      status = CASE WHEN CASE WHEN v_new_due < 0 THEN 0 ELSE v_new_due END = 0 THEN 'PAID' WHEN CASE WHEN v_new_due < 0 THEN 0 ELSE v_new_due END < v_total_due THEN 'PARTIAL' ELSE 'DUE' END
  WHERE assess_id = p_assess_id;

  -- create receipt
  INSERT INTO receipt(receipt_id, payment_id, receipt_no)
  VALUES (receipt_seq.NEXTVAL, p_payment_id, 'R-'||TO_CHAR(SYSTIMESTAMP,'YYYYMMDDHH24MISSFF3')||'-'||p_payment_id);

  COMMIT;
END;
/
