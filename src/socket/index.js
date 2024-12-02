const { Server } = require('socket.io')

let tasks = require('../db.json').tasks

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
    },
    pingTimeout: 10000,
    pingInterval: 5000,
  })

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`)

    const handleError = (socket, action, err) => {
      console.error(`Error during ${action}:`, err.message)
      socket.emit('error', { action, message: err.message })
    }

    socket.on('addTask', (newTask) => {
      try {
        const requiredFields = ['id', 'name', 'description', 'deadline']

        const missingFields = requiredFields.filter((field) => !newTask[field])
        if (missingFields.length > 0) {
          throw new Error(`Invalid tasks data: missing fields: ${missingFields.join(', ')}`)
        }
        tasks.push(newTask)
        io.emit('change', { action: 'added', task: newTask })
        console.log('New task added:', newTask)
      } catch (err) {
        handleError(socket, 'addTask', err)
      }
    })

    socket.on('deleteTask', (taskId) => {
      try {
        if (!taskId) {
          throw new Error('Task ID is required.')
        }
        const taskExists = tasks.some((task) => task.id === taskId)
        if (!taskExists) {
          throw new Error(`Task with ID ${taskId} does not exist.`)
        }
        tasks = tasks.filter((task) => task.id !== taskId)
        io.emit('change', { action: 'deleted', task: { id: taskId } })
        console.log('Task deleted:', taskId)
      } catch (err) {
        handleError(socket, 'deleteTask', err)
      }
    })

    socket.on('editTask', (updatedTask) => {
      try {
        if (!updatedTask || !updatedTask.id || !updatedTask.name) {
          throw new Error('Invalid task data: id and name are required.')
        }
        const taskIndex = tasks.findIndex((task) => task.id === updatedTask.id)
        if (taskIndex === -1) {
          throw new Error(`Task with ID ${updatedTask.id} does not exist.`)
        }
        tasks[taskIndex] = updatedTask
        io.emit('change', { action: 'edited', task: updatedTask })
        console.log('Task updated:', updatedTask)
      } catch (err) {
        handleError(socket, 'editTask', err)
      }
    })

    socket.on('toggleComplete', ({ id, completed }) => {
      try {
        if (!id || typeof completed !== 'boolean') {
          throw new Error('Invalid data: id and completed are required.')
        }
        const taskIndex = tasks.findIndex((task) => task.id === id)
        if (taskIndex === -1) {
          throw new Error(`Task with ID ${id} does not exist.`)
        }
        tasks[taskIndex].completed = completed
        io.emit('change', { action: 'toggledComplete', task: { id, completed } })
        console.log(`Task ${id} marked as ${completed ? 'completed' : 'not completed'}`)
      } catch (err) {
        handleError(socket, 'toggleComplete', err)
      }
    })

    socket.on('error', (err) => {
      console.error('Socket error:', err)
    })

    socket.on('disconnect', (reason) => {
      console.log(`Client disconnected: ${reason}`)
    })
  })
}

module.exports = { initSocket }
