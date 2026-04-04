import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { MovementAction, TroopCode } from '@eoneom/api-client'

import { Button } from '#ui/button'
import { LayoutDetailsContent } from '#ui/layout/details/content'
import { MapDetailsActionBase } from '#map/details/action/base'
import { Sector } from '#types'
import { useGetCity } from '#city/hooks'
import { useGetOutpost } from '#outpost/hooks'
import { useCreateMovement } from '#troop/hooks'

interface Props {
  coordinates: {
    x: number
    y: number
  }
  sector: Sector
}

export const MapDetails: React.FC<Props> = ({ coordinates, sector }) => {
  const { cityId, outpostId } = useParams()
  const { data: city } = useGetCity(cityId)
  const { data: outpost } = useGetOutpost(outpostId)
  const createMovement = useCreateMovement()

  const selectedCell = useMemo(() => {
    if (!coordinates) return null
    return sector.cells.find(cell =>
      cell.coordinates.x === coordinates.x &&
      cell.coordinates.y === coordinates.y
    )
  }, [sector, coordinates])

  const handleExplore = () => {
    if (!sector || !coordinates) return
    const origin = city ? city.coordinates : outpost?.coordinates
    if (!origin) return

    createMovement.mutate({
      action: MovementAction.EXPLORE,
      origin,
      destination: { sector: sector.id, x: coordinates.x, y: coordinates.y },
      troops: [{ code: TroopCode.EXPLORER, count: 1 }]
    })
  }

  const isCityTile =
    city?.coordinates.x === coordinates.x &&
    city?.coordinates.y === coordinates.y

  return <LayoutDetailsContent>
    <div className="details-block">
      <div>
        <h2>Cellule sélectionnée</h2>
        <p className="details-meta">
          Coordonnées{' '}
          <span className="details-coordinates">
            ({coordinates.x}, {coordinates.y})
          </span>
        </p>
      </div>
      {isCityTile && city && <p className="details-highlight">{city.name}</p>}
      {selectedCell && !selectedCell.characteristic && (
        <div className="details-actions">
          <Button onClick={handleExplore}>Explorer</Button>
        </div>
      )}
      {selectedCell && selectedCell.characteristic && sector && (
        <MapDetailsActionBase
          coordinates={{ sector: sector.id, x: coordinates.x, y: coordinates.y }}
        />
      )}
    </div>
  </LayoutDetailsContent>
}
