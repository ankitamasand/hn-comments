const express = require('express')
const posts = express.Router()
const dbPool = require('../model/db')

const posts_m = require('../model/posts_m')

posts.get('/', (req, res) => {
  posts_m.getAll(null, (err, result) => {
    if (err) {
      console.error('Error while fetching posts')
      return res.status(500).json({ message: `Error while fetching posts: ${err}` })
    }

    let rows = null

    if (result && result.length) rows = JSON.parse(result)

    return res.status(200).json({
      status: 'success',
      data: rows
    })
  })
})

posts.post('/', (req, res) => {
  const body = req.body
  const { payload, user_id } = body

  dbPool.getConnection((err, connection) => {
    if (err) {
      console.error(`Error while establishing a connection ${err.message}`)
      return res.status(500).json({ message: err.message })
    }

    connection.beginTransaction(() => {
      const row = {
        payload,
        user_id
      }
      posts_m.insert(connection, row, (err, result) => {
        if (err) {
          console.error(`Error while inserting the post record ${err}`)
          connection.release()
          return res.status(500).json({ message: err })
        }

        connection.commit( err => {
          if (err) {
            console.error(`Error while commiting a transaction ${err}`)
            res.status(500).json({ message: err })
            return connection.rollback( () => {
              connection.release()
            })
          }
          res.status(200).json({ status: 'success' })
          connection.release()
        })
      })
    })
  })
})

module.exports = posts
