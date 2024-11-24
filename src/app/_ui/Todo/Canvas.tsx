import React, { useEffect, useRef, useState } from 'react'

import * as fabric from 'fabric'

import { Task } from '@/types'

export const Canvas = ({ tasks }: { tasks: Task[] }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [canvasWidth, setCanvasWidth] = useState(650)

  const saveOrder = (order: string[]) => {
    localStorage.setItem('taskOrder', JSON.stringify(order))
  }

  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const maxWidth = 650
        const width = Math.min(containerRef.current.offsetWidth, maxWidth)
        setCanvasWidth(width)
      }
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)
    return () => {
      window.removeEventListener('resize', updateCanvasSize)
    }
  }, [])

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    const canvasElement = canvasRef.current
    const width = canvasWidth
    const height = tasks.length * 90

    canvasElement.width = width
    canvasElement.height = height

    const canvas = new fabric.Canvas(canvasElement)
    canvas.clear()

    const taskHeight = 50
    const gap = 20

    let currentY = 10

    const savedOrder: string[] = JSON.parse(localStorage.getItem('taskOrder') || '[]')

    const createGroups = () => {
      tasks
        .sort((a, b) => {
          const indexA = savedOrder.indexOf(a.id)
          const indexB = savedOrder.indexOf(b.id)
          return indexA === -1 ? 1 : indexB === -1 ? -1 : indexA - indexB
        })
        .forEach((task) => {
          const taskWidth = width - 40

          const rect = new fabric.Rect({
            width: taskWidth,
            height: taskHeight,
            fill: '#f3f4f6',
            rx: 8,
            ry: 8,
            stroke: 'rgb(226 232 240)',
            strokeWidth: 1,
          })

          const text = new fabric.Textbox(task.name, {
            fontSize: 14,
            fill: '#1f2937',
            width: taskWidth - 20,
            textAlign: 'center',
            fontFamily: 'Arial',
            top: 10,
          })

          const dateText = new fabric.Textbox(task.deadline, {
            fontSize: 12,
            fill: '#9ca3af',
            top: taskHeight - 20,
            textAlign: 'center',
            fontFamily: 'Arial',
          })

          dateText.left = (taskWidth - dateText.width!) / 2

          const group = new fabric.Group([rect, text, dateText], {
            left: 10,
            top: currentY,
            hasControls: false,
            hasBorders: false,
          })

          group.set('id', task.id)
          canvas.add(group)

          currentY += taskHeight + gap
        })
    }

    createGroups()

    const updateOrder = () => {
      const orderedGroups = canvas
        .getObjects()
        .filter((obj) => obj.type === 'group') as fabric.Group[]

      const sortedGroups = orderedGroups.sort((a, b) => (a.top || 0) - (b.top || 0))
      const orderedIds = sortedGroups.map((group) => group.get('id') as string)
      saveOrder(orderedIds)
    }

    canvas.on('object:modified', updateOrder)

    return () => {
      canvas.dispose()
    }
  }, [tasks, canvasWidth])

  return (
    <div ref={containerRef} className="mx-auto border rounded-lg my-4 p-2 py-4 h-auto">
      <canvas ref={canvasRef} />
    </div>
  )
}
