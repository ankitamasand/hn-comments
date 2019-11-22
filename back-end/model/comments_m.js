const dbPool = require('./db')

const _addComment = (connection, row, callback) => {
  connection = connection || dbPool
  const { payload, user_id, post_id, parent_id } = row
  connection.query('INSERT INTO comments (payload, user_id, post_id, parent_id) VALUES (?, ?, ?, ?)', [payload, user_id, post_id, parent_id], (err, result) => {
    if (err) return callback(err)
    callback(null, result)
  })
}

const _getComment = (connection, id, callback) => {
  connection = connection || dbPool
  connection.query('SELECT user_id FROM comments WHERE id = ?', [id], (err, result) => {
    if (err) return callback(err)
    callback(null, result)
  })
}

const _update = (connection, row, callback) => {
  connection = connection || dbPool
  const { payload, id } = row
  connection.query('UPDATE comments SET payload = ? WHERE id = ?', [payload, id], (err, result) => {
    if (err) return callback(err)
    callback(null, result)
  })
}

const comments_m = {
  addComment: _addComment,
  getComment: _getComment,
  update: _update
}

module.exports = comments_m
