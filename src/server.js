const express = require('express')
const http = require('http')
const jsonServer = require('json-server')
const cors = require('cors')
const { initSocket } = require('./socket')

const app = express()

const router = jsonServer.router('src/db.json')
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
)
app.use(jsonServer.defaults())
app.use(router)

const server = http.createServer(app)

initSocket(server)

const PORT = 3003
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
