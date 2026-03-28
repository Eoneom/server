import { getCellFillStyle } from '#map/helper'
import { Sector } from '#types'
import React, { useEffect, useRef } from 'react'

interface Props {
  onCellClicked: (params: { x: number, y: number }) => void
  sector: Sector
}

export const MapCanvas: React.FC<Props> = ({ onCellClicked, sector }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) {
      return
    }

    const rect = canvasRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const computedStyle = getComputedStyle(canvasRef.current)
    const cell_width = parseInt(computedStyle.getPropertyValue('width'), 10) / 10
    const cell_height = parseInt(computedStyle.getPropertyValue('height'), 10) / 10

    onCellClicked({
      x: Math.ceil(x/cell_width),
      y: Math.sqrt(sector.cells.length) - Math.ceil(y/cell_height) + 1,
    })
  }

  useEffect(() => {
    if (!canvasRef.current || !sector) {
      return
    }

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) {
      return
    }

    ctx.font = '30px Montserrat'
    const WIDTH = canvasRef.current.width / Math.sqrt(sector.cells.length)
    const TOTAL_HEIGHT = canvasRef.current.height
    const HEIGHT = TOTAL_HEIGHT /  Math.sqrt(sector.cells.length)

    sector.cells.forEach(cell => {
      ctx.fillStyle = getCellFillStyle({ type: cell.characteristic?.type })

      const square_x = (cell.coordinates.x - 1)*WIDTH
      const square_y = TOTAL_HEIGHT-cell.coordinates.y*HEIGHT
      ctx.fillRect(square_x, square_y, WIDTH, HEIGHT)

      ctx.fillStyle = '#000'
      ctx.fillText(`${cell.coordinates.x} ${cell.coordinates.y}`, square_x + WIDTH / 4, square_y + HEIGHT - 10)

      ctx.strokeRect(square_x, square_y, WIDTH, HEIGHT)
    })
  }, [sector])

  return sector && <>
    <h2>Secteur {sector.id}</h2>
    <canvas
      id="map"
      ref={canvasRef}
      onClick={handleCanvasClick}
      width="2000"
      height="1125"/>
  </>
}
