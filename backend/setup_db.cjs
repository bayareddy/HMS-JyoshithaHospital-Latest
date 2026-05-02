const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true
});

const promisePool = pool.promise();

async function setupDatabase() {
  try {
    console.log('Setting up database...');

    // Read the SQL file
    const sqlFile = path.join(__dirname, '..', 'setup_database.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Execute the SQL
    await promisePool.query(sql);

    console.log('Database setup completed successfully!');

    // Check staff count
    const [staffResult] = await promisePool.query('SELECT COUNT(*) as count FROM staff');
    console.log(`Staff records: ${staffResult[0].count}`);

    const [rolesResult] = await promisePool.query('SELECT COUNT(*) as count FROM roles');
    console.log(`Role records: ${rolesResult[0].count}`);

    const [deptResult] = await promisePool.query('SELECT COUNT(*) as count FROM departments');
    console.log(`Department records: ${deptResult[0].count}`);

  } catch (error) {
    console.error('Database setup failed:', error.message);
  } finally {
    pool.end();
  }
}

setupDatabase();