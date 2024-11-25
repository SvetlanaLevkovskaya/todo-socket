'use client'

import { Canvas } from '@/app/_ui/Canvas/Canvas'
import { FilterSection } from '@/app/_ui/FilterSection/FilterSection'
import { SortSelect } from '@/app/_ui/SortSelect/SortSelect'
import { TaskEditor } from '@/app/_ui/TaskEditor/TaskEditor'
import { TaskList } from '@/app/_ui/TaskList/TaskList'
import { useTasks } from '@/hooks'

export const Todo = () => {
  const {
    filteredTasks,
    selectedFilters,
    sortOrder,
    editingTask,
    isTaskEditorVisible,
    setSelectedFilters,
    setSortOrder,
    setTaskEditorVisible,
    setEditingTask,
    handleSaveTask,
    handleDeleteTask,
    handleToggleComplete,
  } = useTasks()

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
            setTaskEditorVisible(true)
          }}
          onDelete={handleDeleteTask}
          onAddTask={() => {
            setEditingTask(null)
            setTaskEditorVisible(true)
          }}
          onToggleComplete={handleToggleComplete}
        />
        {isTaskEditorVisible && (
          <div className="my-4 pb-6">
            <TaskEditor
              initialTask={editingTask}
              onSave={handleSaveTask}
              onCancel={() => setTaskEditorVisible(false)}
            />
          </div>
        )}
        <Canvas tasks={filteredTasks} />
      </div>
    </div>
  )
}
