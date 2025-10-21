Database migration and usage instructions

This project contains SQL DDL and helper code for running the application against MySQL or Oracle.

Files added:
- sql/schema_mysql.sql — production-ready MySQL DDL (InnoDB, constraints, indexes)
- sql/sample_data_mysql.sql — sample data compatible with MySQL DDL
- sql/stored_procs_mysql.sql — stored procedures and triggers for MySQL
- sql/schema_oracle.sql — Oracle DDL using sequences and triggers
- sql/stored_procs_oracle.sql — Oracle PL/SQL procedures
- src/lib/mysqlClient.ts — minimal MySQL connection helper using mysql2/promise

Quick start (MySQL)
1. Create a MySQL instance (local or cloud) and ensure you have a DATABASE URL like:
   mysql://user:password@host:3306/dbname
2. From the project root, load the schema and sample data (using the MySQL client):

   # apply schema
   mysql -u user -p -h host dbname < sql/schema_mysql.sql

   # apply stored procs
   mysql -u user -p -h host dbname < sql/stored_procs_mysql.sql

   # load sample data
   mysql -u user -p -h host dbname < sql/sample_data_mysql.sql

3. Set environment variable for the Next.js app (in .env.local):
   MYSQL_DATABASE_URL="mysql://user:password@host:3306/dbname"

4. Update imports where the app used `src/lib/db.ts` (Postgres) to use `src/lib/mysqlClient.ts`.

Notes and next steps
- The added `mysql2` dependency must be installed when switching to MySQL: `npm install mysql2`.
- Oracle integration requires Oracle client tooling and privileges. The `schema_oracle.sql` is provided as a starting point.
- Consider adding migration tooling (Flyway, Liquibase, or knex/migrate) for production migrations.
