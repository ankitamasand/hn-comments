const mysql = require('mysql')
const { mysqlConfig: config } = require('../config')

const pool = mysql.createPool({
  host: config.HOST,
  port: config.PORT,
  user: config.USER,
  password: config.PASSWORD,
  database: config.DATABASE,
  charset: config.CHARSET,
  connectionLimit: config.MAX_CONNECTIONS
})

module.exports = pool
