import { FaPlus } from 'react-icons/fa6'

import { Task } from '@/types'
import { truncateTitle } from '@/utils'

export const TaskList = ({
  tasks,
  onEdit,
  onDelete,
  onAddTask,
  onToggleComplete,
}: {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onAddTask: () => void
  onToggleComplete: (id: string, completed: boolean) => void
}) => {
  const handleEdit = (task: Task): void => {
    onEdit(task)
  }

  const handleToggleComplete = (id: string, completed: boolean) => {
    onToggleComplete(id, completed)
  }

  return (
    <div className="pb-4">
      <h2 className="text-base font-medium mb-8">Tasks</h2>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`flex justify-between gap-2 items-center p-2 border rounded-lg ${
              task.completed ? 'bg-teal-50' : ''
            }`}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={(e) => handleToggleComplete(task.id, e.target.checked)}
              className="mr-2 h-3 w-3 accent-orange-300 focus:ring-2 focus:ring-offset-2 focus:ring-orange-300 transition-all hover:scale-110"
            />
            <span className="text-sm break-all">{truncateTitle(task.name, 20)}</span>
            <span className="text-sm break-all">{task.deadline}</span>
            <div className="flex justify-center gap-2 flex-col sm:flex-row">
              <button
                onClick={() => handleEdit(task)}
                className="px-2 py-1 bg-cyan-500 text-white rounded text-sm "
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="px-2 py-1 bg-rose-500 text-white rounded text-sm "
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={onAddTask}
        className="flex justify-center items-center px-4 py-2 border rounded-lg w-full my-2 bg-orange-300 text-white"
      >
        <FaPlus className="mr-2" color="white" />
        Add task
      </button>
    </div>
  )
}
