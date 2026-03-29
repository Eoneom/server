import { terrainLegend } from '#map/helper'
import React, { useMemo } from 'react'
import { Group, Rect, Text } from 'react-konva'

const LEGEND_PAD = 10
const LEGEND_INNER = 10
const LEGEND_ROW_H = 18
const LEGEND_ROW_GAP = 4
const LEGEND_SWATCH = 14
const LEGEND_WIDTH = 158

const legendBoxHeight =
  LEGEND_INNER * 2 +
  terrainLegend.length * LEGEND_ROW_H +
  (terrainLegend.length - 1) * LEGEND_ROW_GAP

interface MapLegendOverlayProps {
  stageHeight: number
}

export const MapLegendOverlay: React.FC<MapLegendOverlayProps> = ({
  stageHeight,
}) => {
  const rows = useMemo(
    () =>
      terrainLegend.map((item, i) => {
        const y = LEGEND_INNER + i * (LEGEND_ROW_H + LEGEND_ROW_GAP)
        return (
          <Group
            key={String(item.key)}
            x={LEGEND_INNER}
            y={y}
            listening={false}
          >
            <Rect
              width={LEGEND_SWATCH}
              height={LEGEND_ROW_H}
              fill={item.color}
              stroke="rgba(0,0,0,0.35)"
              strokeWidth={1}
              cornerRadius={2}
              listening={false}
            />
            <Text
              x={LEGEND_SWATCH + 8}
              y={2}
              text={item.label}
              fontSize={12}
              fontFamily="Montserrat, sans-serif"
              fill="#e8e8ec"
              listening={false}
            />
          </Group>
        )
      }),
    [],
  )

  return (
    <Group
      x={LEGEND_PAD}
      y={stageHeight - legendBoxHeight - LEGEND_PAD}
      listening={false}
    >
      <Rect
        width={LEGEND_WIDTH}
        height={legendBoxHeight}
        fill="rgba(22,22,30,0.9)"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth={1}
        cornerRadius={6}
        listening={false}
      />
      {rows}
    </Group>
  )
}
