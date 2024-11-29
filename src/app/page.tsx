import { fetchTasks } from '@/services/apiService'

import { Todo } from '@/app/_ui'

export default async function Home() {
  const initialTasks = process.env.NODE_ENV === 'production' ? [] : await fetchTasks()
  return <Todo initialTasks={initialTasks} />
}
