const dbPool = require('./db')

const _insert = (connection, row, callback) => {
  connection = connection || dbPool
  const { email, name } = row
  connection.query('INSERT INTO user (email, name) VALUES (?, ?)', [email, name], (err, result) => {
    if (err) return callback(err)
    callback(null, result)
  })
}

const user_m = {
  insert: _insert
}

module.exports = user_m
