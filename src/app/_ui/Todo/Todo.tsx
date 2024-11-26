'use client'

import { useState } from 'react'

import { Canvas } from '@/app/_ui/Canvas/Canvas'
import { FilterSection } from '@/app/_ui/FilterSection/FilterSection'
import { SortSelect } from '@/app/_ui/SortSelect/SortSelect'
import { TaskEditor } from '@/app/_ui/TaskEditor/TaskEditor'
import { TaskList } from '@/app/_ui/TaskList/TaskList'
import { useTasks } from '@/hooks'
import { Task } from '@/types'

export const Todo = () => {
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isTaskEditorVisible, setTaskEditorVisible] = useState(false)

  const {
    filteredTasks,
    saveTask,
    deleteTaskById,
    toggleComplete,
    selectedFilters,
    sortOrder,
    setSelectedFilters,
    setSortOrder,
  } = useTasks()

  const handleSave = async (task: Task | Omit<Task, 'id'>) => {
    await saveTask(task)
    setTaskEditorVisible(!isTaskEditorVisible)
  }

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
          onDelete={deleteTaskById}
          onAddTask={() => {
            setEditingTask(null)
            setTaskEditorVisible(!isTaskEditorVisible)
          }}
          onToggleComplete={toggleComplete}
        />
        {isTaskEditorVisible && (
          <div className="my-4 pb-6">
            <TaskEditor
              initialTask={editingTask}
              onSave={handleSave}
              onCancel={() => setTaskEditorVisible(!isTaskEditorVisible)}
            />
          </div>
        )}
        <Canvas tasks={filteredTasks} />
      </div>
    </div>
  )
}
