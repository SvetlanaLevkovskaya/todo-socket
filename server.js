const express = require('express')
const http = require('http')
const jsonServer = require('json-server')
const cors = require('cors')
const { Server } = require('socket.io')

const app = express()

const router = jsonServer.router('db.json')
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
)
app.use(jsonServer.defaults())
app.use(router)

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
})

let tasks = require('./db.json').tasks

io.on('connection', (socket) => {
  console.log('New client connected')

  /*  setInterval(() => {
    socket.emit('change', { updated: true, timestamp: new Date() })
  }, 5000)*/

  socket.on('addTask', (newTask) => {
    tasks.push(newTask)
    io.emit('change', { action: 'added', task: newTask })
    console.log('New task added:', newTask)
  })

  socket.on('deleteTask', (taskId) => {
    tasks = tasks.filter((task) => task.id !== taskId)
    io.emit('change', { action: 'deleted', taskId })
    console.log('Task deleted:', taskId)
  })

  socket.on('editTask', (updatedTask) => {
    tasks = tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    io.emit('change', { action: 'edited', task: updatedTask })
    console.log('Task updated:', updatedTask)
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected')
  })
})

const PORT = 3003
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
