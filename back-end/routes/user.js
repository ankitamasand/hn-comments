const express = require('express')
const user = express.Router()
const dbPool = require('../model/db')

const user_m = require('../model/user_m')

user.post('/register', (req, res) => {
  const body = req.body
  const { email, name } = body

  dbPool.getConnection( (err, connection) => {
    if (err) {
      console.error(`Error while establishing a connection ${err.message}`)
      return res.status(500).json({ message: err.message })
    }

    connection.beginTransaction( () => {
      const row = {
        email,
        name
      }

      user_m.insert(connection, row, (err, result) => {
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
          req.session.user_id = result.insertId
          res.status(200).json({ status: 'success', data: { userId: result.insertId }})
          connection.release()
        })
      })
    })
  })
})

module.exports = user
