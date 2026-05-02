const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const promisePool = pool.promise();

async function checkTable() {
  try {
    // Check if table exists
    const [tables] = await promisePool.query(
      "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'schedule_templates'",
      [process.env.DB_NAME]
    );
    
    if (tables.length === 0) {
      console.log('Table schedule_templates does not exist');
      return;
    }
    
    console.log('Table schedule_templates exists');
    
    // Get table structure
    const [columns] = await promisePool.query(
      "SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, COLUMN_COMMENT FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'schedule_templates' ORDER BY ORDINAL_POSITION",
      [process.env.DB_NAME]
    );
    
    console.log('Table structure:');
    columns.forEach(col => {
      console.log(`  ${col.COLUMN_NAME}: ${col.DATA_TYPE} (nullable: ${col.IS_NULLABLE}, default: ${col.COLUMN_DEFAULT})`);
    });
    
    // Check current data
    const [rows] = await promisePool.query('SELECT * FROM schedule_templates');
    console.log(`Current data count: ${rows.length}`);
    if (rows.length > 0) {
      console.log('Sample row:', JSON.stringify(rows[0], null, 2));
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    pool.end();
  }
}

checkTable();