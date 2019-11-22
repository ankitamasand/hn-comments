const dbPool = require('./db')

const _getAll = (connection, callback) => {
  connection = connection || dbPool
  connection.query('SELECT id, payload, user_id, created_at, updated_at FROM posts', null, (err, result) => {
    if (err) {
      return callback(err, null, 500)
    }
    return callback(null, result, 200)
  })
}

const _insert = (connection, row, callback) => {
  connection = connection || dbPool
  const { payload, user_id } = row
  connection.query('INSERT INTO posts (payload, user_id) VALUES (?, ?)', [payload, user_id], (err, result) => {
    if (err) return callback(err)
    callback(null, result)
  })
}

const posts_m = {
  getAll: _getAll,
  insert: _insert
}

module.exports = posts_m
