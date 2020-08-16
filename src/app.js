//It's important to separate the express app configuration from the app.listen() that start the app
//to allow us importing the app configuration for supertest without start the server. Both index.js
//and supertest files will require the app from here.
require('./db/mongoose')
const express = require('express')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

module.exports = app