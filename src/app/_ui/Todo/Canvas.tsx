import React, { useEffect, useRef } from 'react'

import * as fabric from 'fabric'

export const Canvas = ({ tasks }: any) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current as HTMLCanvasElement)

    canvas.clear()

    tasks.forEach((task: any, index: number) => {
      const rect = new fabric.Rect({
        left: 50 + index * 100,
        top: 50,
        fill: 'blue',
        width: 50,
        height: 50,
      })

      const text = new fabric.Textbox(task.name, {
        left: 50 + index * 100,
        top: 120,
        fontSize: 14,
        fill: 'black',
        width: 90, // Ограничение ширины текста
        textAlign: 'center', // Выравнивание текста
      })

      canvas.add(rect)
      canvas.add(text)
    })

    return () => {
      canvas.dispose()
    }
  }, [tasks])

  return <canvas ref={canvasRef} width={650} height={200} className="border" />
}
