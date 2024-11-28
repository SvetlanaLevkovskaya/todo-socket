import { memo } from 'react'

import { Task } from '@/types'
import { formattedDate, truncateTitle } from '@/utils'

export const TaskListComponent = ({
  tasks,
  onEdit,
  onDelete,
  onToggleComplete,
}: {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onToggleComplete: (id: string, completed: boolean) => void
}) => {
  console.log('TaskList')
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
        {tasks &&
          tasks?.map((task, index) => (
            <li
              key={`${index}-${task.id}`}
              className={`flex justify-between gap-2 items-center p-2 border rounded-lg ${
                task.completed ? 'bg-teal-50' : ''
              }`}
            >
              <div className="flex justify-center items-center gap-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={(e) => handleToggleComplete(task.id, e.target.checked)}
                  className="mr-2 h-3 w-3 accent-orange-300 focus:ring-2 focus:ring-offset-2 focus:ring-orange-300 transition-all hover:scale-110"
                />
                <div className="flex flex-col gap-2 sm:flex-row">
                  <span className="text-sm break-all">{truncateTitle(task.name, 20)}</span>
                  <span className="text-sm text-slate-500">{formattedDate(task.deadline)}</span>
                </div>
              </div>
              <div className="flex justify-center gap-2 flex-col sm:flex-row">
                <button
                  onClick={() => handleEdit(task)}
                  className="px-2 py-1 bg-cyan-500 text-white rounded text-sm shadow-lg hover:shadow-xl active:shadow-md transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="px-2 py-1 bg-rose-500 text-white rounded text-sm shadow-lg hover:shadow-xl active:shadow-md transition-all"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  )
}

TaskListComponent.displayName = 'TaskList'

export const TaskList = memo(TaskListComponent)
