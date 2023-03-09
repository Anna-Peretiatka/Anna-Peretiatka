const mysql = require('mysql2/promise');
const dbConfig = require('./db.config.js');

// Create a connection to the database
const pool = mysql.createPool({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const getConnection = async () => {
    try {
      const connection = await pool.getConnection();
      return connection;
    } catch (error) {
      console.error(`Error getting database connection: ${error.message}`);
      throw error;
    }
  };
  
  module.exports = { pool,getConnection };
