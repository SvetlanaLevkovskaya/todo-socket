'use client'

import { useCallback, useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa6'

import {
  createTask,
  deleteTask,
  fetchTasks,
  toggleTaskCompletion,
  updateTask,
} from '@/services/apiService'
import { getSocket } from '@/services/socket'

import { Canvas } from '@/app/_ui/Canvas/Canvas'
import { FilterSection } from '@/app/_ui/FilterSection/FilterSection'
import { SortSelect } from '@/app/_ui/SortSelect/SortSelect'
import { TaskEditor } from '@/app/_ui/TaskEditor/TaskEditor'
import { TaskList } from '@/app/_ui/TaskList/TaskList'
import { Spinner, customToastError, customToastSuccess } from '@/components'
import { useSearch } from '@/providers/searchProvider'
import { Task } from '@/types'
import { readFromLocalStorage, saveToLocalStorage } from '@/utils'

export const Todo = ({ initialTasks }: { initialTasks: Task[] }) => {
  const { searchQuery } = useSearch()
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isTaskEditorVisible, setTaskEditorVisible] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<string>(
    readFromLocalStorage('selectedFilter', 'all')
  )
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
    readFromLocalStorage('sortOrder', 'asc') as 'asc' | 'desc'
  )
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])

  useEffect(() => {
    if (tasks.length > 0) {
      setIsLoading(false)
    } else {
      fetchTasks()
        .then((fetchedTasks) => {
          setTasks(fetchedTasks)

          setIsLoading(false)
        })
        .catch(() => {
          setIsLoading(false)
        })
    }
  }, [tasks.length])

  useEffect(() => {
    if (!isLoading) {
      setTasks(tasks)
    }
  }, [tasks, isLoading])

  useEffect(() => {
    const socket = getSocket()

    const handleSocketChange = (change: {
      action: string
      task?: Task
      taskId?: string
      id?: string
      completed?: boolean
    }) => {
      setTasks((prev) => {
        switch (change.action) {
          case 'added':
            return [...prev, change.task!]
          case 'deleted':
            return prev.filter((task) => task.id !== change.taskId)
          case 'edited':
            return prev.map((task) => (task.id === change.task!.id ? change.task! : task))
          case 'toggledComplete':
            return prev.map((task) =>
              task.id === change.id ? { ...task, completed: change.completed! } : task
            )
          default:
            return prev
        }
      })
    }

    socket.on('change', handleSocketChange)

    return () => {
      socket.off('change', handleSocketChange)
    }
  }, [])

  useEffect(() => {
    const applyFilters = () => {
      let result = tasks.filter((task) =>
        task.name.toLowerCase().includes(searchQuery.toLowerCase())
      )

      if (selectedFilters === 'done') {
        result = result.filter((task) => task.completed)
      } else if (selectedFilters === 'in progress') {
        result = result.filter((task) => !task.completed)
      }

      result = result.sort((a, b) => {
        const dateA = new Date(a.deadline).getTime()
        const dateB = new Date(b.deadline).getTime()
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
      })

      setFilteredTasks(result)
    }

    applyFilters()
  }, [tasks, selectedFilters, searchQuery, sortOrder])

  useEffect(() => {
    saveToLocalStorage('selectedFilter', selectedFilters)
    saveToLocalStorage('sortOrder', sortOrder)
  }, [selectedFilters, sortOrder])

  const handleSaveTask = useCallback(async (task: Task | Omit<Task, 'id'>) => {
    try {
      if ('id' in task) {
        const updatedTask = await updateTask(task)
        const socket = getSocket()
        socket.emit('editTask', updatedTask)
        customToastSuccess(`Task ${task.name} updated successfully`)
      } else {
        const newTask = await createTask(task)
        const socket = getSocket()
        socket.emit('addTask', newTask)
        customToastSuccess(`Task ${task.name} created successfully`)
      }
      setTaskEditorVisible(false)
    } catch (error) {
      customToastError('Failed to save task')
      console.error('Error saving task:', error)
    }
  }, [])

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id)
      const socket = getSocket()
      socket.emit('deleteTask', id)
      customToastSuccess(`Task ${id} deleted successfully`)
    } catch (error) {
      customToastError('Failed to delete task')
      console.error('Error deleting task:', error)
    }
  }

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      const updatedTask = await toggleTaskCompletion(id, completed)
      const socket = getSocket()
      socket.emit('toggleComplete', { id, completed })
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? { ...task, completed: updatedTask.completed } : task
        )
      )
      customToastSuccess(`Task ${id} status updated successfully`)
    } catch (error) {
      customToastError('Failed to toggle task completion')
      console.error('Error toggling task completion:', error)
    }
  }

  if (isLoading) return <Spinner />

  return (
    <div className="flex flex-col md:flex-row justify-center gap-6 sm:gap-24">
      <div className="flex flex-col gap-4">
        <FilterSection selectedFilters={selectedFilters} onFilterChange={setSelectedFilters} />
        <SortSelect sortOrder={sortOrder} onSortChange={setSortOrder} />
      </div>

      <div className="flex-grow px-4 max-w-[650px] min-w-[330px] w-full">
        <TaskList
          tasks={filteredTasks}
          onEdit={(task) => {
            setEditingTask(task)
            setTaskEditorVisible(!isTaskEditorVisible)
          }}
          onDelete={handleDeleteTask}
          onToggleComplete={handleToggleComplete}
        />
        {isTaskEditorVisible && (
          <div className="my-4 pb-6">
            <TaskEditor
              initialTask={editingTask}
              onSave={handleSaveTask}
              onCancel={() => setTaskEditorVisible(!isTaskEditorVisible)}
            />
          </div>
        )}

        <div className="flex flex-col gap-6 my-6">
          <button
            onClick={() => {
              setEditingTask(null)
              setTaskEditorVisible(!isTaskEditorVisible)
            }}
            className="flex justify-center items-center p-3 border border-orange-400 rounded-lg w-full my-2 bg-orange-300 text-white shadow-lg hover:shadow-xl active:shadow-md transition-all"
          >
            <FaPlus className="mr-2" color="white" />
            Add task
          </button>
        </div>
        <Canvas tasks={filteredTasks} />
      </div>
    </div>
  )
}
