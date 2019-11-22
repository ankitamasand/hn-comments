const express = require('express')
const comments = express.Router()
const dbPool = require('../model/db')

const comments_m = require('../model/comments_m')

comments.get('/:postId', (err, result) => {

})

comments.post('/add', (req, res) => {
  const { body } = req
  const { payload, post_id, parent_id, user_id } = body

  dbPool.getConnection((err, connection) => {
    if (err) {
      console.error(`Error while establishing a connection ${err.message}`)
      return res.status(500).json({ message: err.message })
    }

    connection.beginTransaction(() => {
      const row = {
        payload,
        post_id,
        parent_id,
        user_id
      }
      comments_m.addComment(connection, row, (err, result) => {
        if (err) {
          console.error(`Error while adding the comment ${err}`)
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

comments.put('/edit', (req, res) => {
  const { body } = req
  const { payload, user_id, id } = body

  comments_m.getComment(null, id, (err, result) => {
    if (err) {
      console.error('Error while fetching the existing comment')
      return res.status(500).json({ message: `Error while fetching the existing comment: ${err}` })
    }

    if (result && result.length > 0) {

      if (result[0].user_id != user_id) {
        console.error(`Error while editing the comment: you are not authorized to edit others comments.`)
        return res.status(500).json({ message: `Error while editing the comment: you are not authorized to edit others comments.` })
      }

      dbPool.getConnection((err, connection) => {
        if (err) {
          console.error(`Error while establishing a connection ${err.message}`)
          return res.status(500).json({ message: err.message })
        }

        connection.beginTransaction(() => {
          const row = {
            id,
            payload
          }

          comments_m.update(connection, row, (err, result) => {
            if (err) {
              console.error(`Error while updating the comment ${err}`)
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
    } else {
      res.status(500).json({ status: 'fail', message: 'No matched records found!' })
    }
  })
})

module.exports = comments
