import { FaPlus } from 'react-icons/fa6'

import { Task } from '@/types'
import { truncateTitle } from '@/utils'

export const TaskList = ({
  tasks,
  onEdit,
  onDelete,
  onAddTask,
}: {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onAddTask: () => void
}) => {
  const handleEdit = (task: Task): void => {
    console.log('task', task)
    onEdit(task)
  }

  return (
    <div className="pb-4">
      <h2 className="text-base font-medium mb-8">Tasks</h2>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex justify-between gap-2 items-center p-2 border rounded-lg"
          >
            <span className="text-sm break-all">{truncateTitle(task.name, 20)}</span>
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
