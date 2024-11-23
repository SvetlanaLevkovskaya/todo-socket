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
        fill: 'lightgray',
        width: 100,
        height: 100,
      })

      const text = new fabric.Textbox(task.name, {
        left: 50 + index * 100,
        top: 120,
        fontSize: 14,
        fill: 'black',
        width: 90,
        textAlign: 'center',
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
