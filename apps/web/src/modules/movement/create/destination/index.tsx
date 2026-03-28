import { MovementCreateDestinationCoordinate } from '#movement/create/destination/coordinate'
import { Coordinates } from '@kroust/swarm-client'
import React from 'react'

interface Props {
  destination: Coordinates
  onChange: (coordinates: Coordinates) => void
}

export const MovementCreateDestination: React.FC<Props> = ({ destination, onChange }) => {
  return <div id="destination">
    <h3>Destination</h3>
    <div id="coordinates">
      <span>
        <label>Secteur</label>
        <MovementCreateDestinationCoordinate
          value={destination.sector}
          placeholder='Secteur'
          onChange={sector => onChange({...destination, sector })}
        />
      </span>
      <span>
        <label>X</label>
        <MovementCreateDestinationCoordinate
          value={destination.x}
          placeholder='X'
          onChange={x => onChange({...destination, x })}
        />
      </span>
      <span>
        <label>Y</label>
        <MovementCreateDestinationCoordinate
          value={destination.y}
          placeholder='Y'
          onChange={y => onChange({...destination, y })}
        />
      </span>
    </div>
  </div>
}
