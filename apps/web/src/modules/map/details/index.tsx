import React, { useMemo } from 'react'

import { MovementAction, TroupCode } from '@kroust/swarm-client'

import { Button } from '#ui/button'
import { LayoutDetailsContent } from '#ui/layout/details/content'
import { MapDetailsActionBase } from '#map/details/action/base'
import { Sector } from '#types'
import { useAppDispatch, useAppSelector } from '#store/type'
import { selectCity } from '#city/slice'
import { selectOutpostCoordinates } from '#outpost/slice'
import { createMovement } from '#troup/slice/thunk'

interface Props {
  coordinates: {
    x: number
    y: number
  }
  sector: Sector
}

export const MapDetails: React.FC<Props> = ({ coordinates, sector }) => {
  const dispatch = useAppDispatch()

  const city = useAppSelector(selectCity)
  const outpostCoordinates = useAppSelector(selectOutpostCoordinates)

  const selectedCell = useMemo(() => {
    if (!coordinates) {
      return null
    }

    return sector.cells.find(cell =>
      cell.coordinates.x === coordinates.x &&
      cell.coordinates.y === coordinates.y
    )
  }, [sector, coordinates])

  const handleExplore = () => {
    if (!sector || !coordinates) {
      return
    }

    const origin = city ? city.coordinates : outpostCoordinates
    if (!origin) {
      return
    }

    dispatch(createMovement({
      action: MovementAction.EXPLORE,
      origin,
      destination: { sector: sector.id, x: coordinates.x, y: coordinates.y },
      troups: [{
        code: TroupCode.EXPLORER,
        count: 1
      }]
    }))
  }

  return <LayoutDetailsContent>
    <h2>Cellule sélectionnée: ({coordinates.x};{coordinates.y})</h2>
    {
      city?.coordinates.x === coordinates.x &&
      city?.coordinates.y === coordinates.y &&
      <>{city.name}</>
    }
    {
      selectedCell && !selectedCell.characteristic && <Button onClick={handleExplore}>Explorer</Button>
    }
    {
      selectedCell &&
      selectedCell.characteristic &&
      sector &&
      <MapDetailsActionBase coordinates={{sector: sector.id, x: coordinates.x, y: coordinates.y}}/>
    }
  </LayoutDetailsContent>
}
