let config = {
  API_SERVER_PORT: 9000,
  mysqlConfig: {
    HOST: 'localhost',
    PORT: '3306',
    USER: 'admin',
    PASSWORD: 'password',
    DATABASE: 'hn',
    CHARSET: 'utf8mb4',
    MAX_CONNECTIONS: 10
  }
}

module.exports = config
