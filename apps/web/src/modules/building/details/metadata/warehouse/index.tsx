import { transformDecimals } from '#helpers/transform'
import React from 'react'

interface Props {
  currentCapacity: number
  nextCapacity: number
}

export const BuildingDetailsMetadataWarehouse: React.FC<Props> = ({ currentCapacity, nextCapacity }) => {
  return <>
    <p>
      Capacité actuelle: <strong>{transformDecimals(currentCapacity)}</strong><br />
      Capacité suivante : <strong>{transformDecimals(nextCapacity)}</strong>
    </p>
  </>
}
