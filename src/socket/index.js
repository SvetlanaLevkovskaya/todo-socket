const { Server } = require('socket.io')

let tasks = require('../db.json').tasks

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
    },
  })

  io.on('connection', (socket) => {
    console.log('New client connected')

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

    socket.on('toggleComplete', ({ id, completed }) => {
      tasks = tasks.map((task) => (task.id === id ? { ...task, completed } : task))
      io.emit('change', { action: 'toggledComplete', id, completed })
      console.log(`Task ${id} marked as ${completed ? 'completed' : 'not completed'}`)
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected')
    })
  })
}

module.exports = { initSocket }
