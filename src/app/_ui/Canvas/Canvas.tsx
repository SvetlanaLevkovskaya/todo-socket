import { memo, useEffect, useRef, useState } from 'react'

import * as fabric from 'fabric'

import { Task } from '@/types'
import { formattedDate, readFromLocalStorage, saveToLocalStorage, truncateTitle } from '@/utils'

export const CanvasComponent = ({ tasks }: { tasks: Task[] }) => {
  console.log('Canvas')
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [canvasWidth, setCanvasWidth] = useState(650)

  const saveOrder = (order: string[]) => {
    saveToLocalStorage('taskOrder', JSON.stringify(order))
  }

  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const maxWidth = 650
        const minWidth = 290
        const containerWidth = containerRef.current.offsetWidth
        const width = Math.max(Math.min(containerWidth, maxWidth), minWidth)
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

    const savedOrder: string[] = JSON.parse(readFromLocalStorage('taskOrder', '[]'))

    const createGroups = () => {
      tasks
        .sort((a, b) => {
          const indexA = savedOrder.indexOf(a.id)
          const indexB = savedOrder.indexOf(b.id)
          return indexA === -1 ? 1 : indexB === -1 ? -1 : indexA - indexB
        })
        .forEach((task) => {
          const padding = 10
          const taskWidth = width - 20

          const truncatedName = truncateTitle(task.name, 25)

          const rect = new fabric.Rect({
            width: taskWidth,
            height: taskHeight,
            fill: task.completed ? '#ccfbf1' : '#f1f5f9',
            rx: 8,
            ry: 8,
            stroke: '#e2e8f0',
            strokeWidth: 1,
            shadow: new fabric.Shadow({
              color: 'rgba(0, 0, 0, 0.15)',
              blur: 10,
              offsetX: 2,
              offsetY: 4,
            }),
          })

          const text = new fabric.Textbox(truncatedName, {
            fontSize: 14,
            fill: '#1f2937',
            width: taskWidth - padding * 2,
            textAlign: 'center',
            top: padding,
            splitByGrapheme: true,
          })

          const dateText = new fabric.Textbox(formattedDate(task.deadline), {
            fontSize: 12,
            fill: '#9ca3af',
            width: taskWidth - padding * 2,
            top: taskHeight - padding * 2,
            textAlign: 'center',
          })

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
    <div ref={containerRef} className="border border-slate-200 rounded-lg min-w-[300px]">
      <canvas ref={canvasRef} />
    </div>
  )
}

CanvasComponent.displayName = 'Canvas'

export const Canvas = memo(CanvasComponent)
