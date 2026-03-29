import { MovementCreateDestinationCoordinate } from '#movement/create/destination/coordinate'
import { Coordinates } from '@eoneom/api-client'
import React from 'react'

interface Props {
  destination: Coordinates
  onChange: (coordinates: Coordinates) => void
}

export const MovementCreateDestination: React.FC<Props> = ({ destination, onChange }) => {
  return (
    <div className="movement-destination" id="destination">
      <h3 className="movement-block-heading">Destination</h3>
      <div className="movement-coords-grid" id="coordinates">
        <label className="movement-coord-field">
          <span className="movement-coord-field__label">Secteur</span>
          <MovementCreateDestinationCoordinate
            value={destination.sector}
            placeholder="Secteur"
            onChange={sector => onChange({ ...destination, sector })}
          />
        </label>
        <label className="movement-coord-field">
          <span className="movement-coord-field__label">X</span>
          <MovementCreateDestinationCoordinate
            value={destination.x}
            placeholder="X"
            onChange={x => onChange({ ...destination, x })}
          />
        </label>
        <label className="movement-coord-field">
          <span className="movement-coord-field__label">Y</span>
          <MovementCreateDestinationCoordinate
            value={destination.y}
            placeholder="Y"
            onChange={y => onChange({ ...destination, y })}
          />
        </label>
      </div>
    </div>
  )
}
