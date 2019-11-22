const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')

const posts = require('./routes/posts')
const user = require('./routes/user')
const comments = require('./routes/comments')

let config = require('./config')

const app = express()
app.use(bodyParser.json())
app.use(session({
  secretKey: 'secret'
}))

app.use('/posts', posts)
app.use('/user', user)
app.use('/comments', comments)

app.listen(config.API_SERVER_PORT, () => {
  console.log(`Server is listening at port ${config.API_SERVER_PORT}`)
})
