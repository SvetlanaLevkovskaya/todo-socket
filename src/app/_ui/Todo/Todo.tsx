'use client'

import { useCallback, useState } from 'react'
import { FaPlus } from 'react-icons/fa6'

import { createTask, deleteTask, toggleTaskCompletion, updateTask } from '@/services/apiService'
import { getSocket } from '@/services/socket'

import { Canvas } from '@/app/_ui/Canvas/Canvas'
import { FilterSection } from '@/app/_ui/FilterSection/FilterSection'
import { SortSelect } from '@/app/_ui/SortSelect/SortSelect'
import { TaskEditor } from '@/app/_ui/TaskEditor/TaskEditor'
import { TaskList } from '@/app/_ui/TaskList/TaskList'
import { Spinner, customToastError, customToastSuccess } from '@/components'
import { useFilteredTasks, useTasks } from '@/hooks'
import { Task } from '@/types'

export const Todo = ({ initialTasks }: { initialTasks: Task[] }) => {
  const { tasks, isLoading, setTasks } = useTasks(initialTasks)
  const { filteredTasks, selectedFilters, setSelectedFilters, sortOrder, setSortOrder } =
    useFilteredTasks(tasks)

  const [isTaskEditorVisible, setTaskEditorVisible] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

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
      console.log('Deleting task with ID:', id)
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
