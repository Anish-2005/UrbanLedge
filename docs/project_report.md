# Online Property Tax Management System (OPTMS)

## 1. Purpose

An Online Property Tax Management System (OPTMS) to allow property owners to register properties, compute annual property tax, pay taxes online, view payment history, and for municipal officers to manage tax slabs, exemptions, assessments and produce reports.

## 2. Primary actors

- Property Owner: register/login, manage properties, view tax due, pay tax
- Municipal Officer (Collector/Assessor): create/adjust tax slabs, verify property assessments, approve exemptions, view reports
- Tax Collector (Cashier): reconcile payments, issue receipts
- System Admin: manage users, roles, audit logs

## 3. High-level functional requirements

- User authentication & role-based access control
- Property registration (owner details, property address, type, built-up area, land area, usage)
- Assessment & tax calculation engine (slabs, rates, exemptions, penalties)
- Online payment integration (store transaction references)
- Receipts generation and download
- CRUD for tax slabs, exemptions, and assessment records
- Reporting (delinquent properties, payments by date, revenue by ward)
- Audit trail for critical operations

## 4. Non-functional requirements

- Consistency and data integrity (ACID)
- Secure storage of sensitive data (hashed passwords, encryption for payment tokens)
- Scalability to tens of thousands of properties
- Backup & recovery procedures
- Compliance: maintain audit logs and transaction timestamps

## 5. Conceptual & Logical Design

Main entities: `user_account`, `role`, `user_role`, `owner`, `property`, `property_type`, `ward`, `tax_slab`, `exemption`, `assessment`, `payment`, `receipt`, `audit_log`.

Relationships:
- `user_account` has many `role`s via `user_role`.
- `owner` owns many `property` records.
- `property` has many `assessment` records (one per financial year).
- `assessment` may reference `tax_slab` and `exemption`.
- `payment` links to `assessment`; `receipt` links to `payment`.

## 6. Testing plan

Include unit tests for SQL logic (where supported), stored procedure logic, and UI flows:
- Test assessment generation for properties that fall within and outside slab ranges.
- Test payment flow: create payment, ensure receipt and assessment status updates.
- Edge cases: overlapping slabs, duplicate assessment for same year, late payment penalty calculation.

## 7. Deliverables & next steps

- `sql/schema.sql` — DDL for MySQL database
- `sql/stored_procs.sql` — Stored procedures, triggers, views
- `sql/sample_data.sql` — Sample INSERTs and sample queries
- `src/app/prototype/page.tsx` — Next.js prototype using Tailwind, lucide-react, framer-motion
- Documentation: this `docs/project_report.md` and updated `README.md`

Next: create SQL files and the prototype page. After that, update README with run instructions.
