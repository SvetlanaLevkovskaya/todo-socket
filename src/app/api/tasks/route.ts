import { NextRequest, NextResponse } from 'next/server'

import { JSON_SERVER_URL } from '@/config/urls'

export async function GET() {
  try {
    const response = await fetch(JSON_SERVER_URL, {
      next: { revalidate: 60 },
    })
    if (!response.ok) {
      console.error('Failed to fetch tasks:', response.statusText)
      return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
    }
    const tasks = await response.json()
    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error during fetch:', error)
    return NextResponse.json({ error: 'An error occurred while fetching tasks' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const response = await fetch(JSON_SERVER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to add task' }, { status: 500 })
    }
    const newTask = await response.json()
    return NextResponse.json(newTask, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred while adding the task' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { pathname } = new URL(req.url)
    const id = pathname.split('/').pop()

    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 })
    }

    const response = await fetch(`${JSON_SERVER_URL}/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
    }
    return NextResponse.json({ message: 'Task deleted' })
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred while deleting the task' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { pathname } = new URL(req.url)
    const id = pathname.split('/').pop()
    const body = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 })
    }

    const response = await fetch(`${JSON_SERVER_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
    }

    const updatedTask = await response.json()
    return NextResponse.json(updatedTask)
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred while updating the task' },
      { status: 500 }
    )
  }
}
