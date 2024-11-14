require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  timezone: process.env.DB_TIMEZONE
});

db.connect(err => {
  if (err) throw err;
  console.log('Conexão com o banco de dados estabelecida.');
});

module.exports = db;
