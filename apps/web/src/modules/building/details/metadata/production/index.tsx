import React from 'react'

import { transformHourlyEarnings } from '#helpers/transform'

interface Props {
  currentProduction: number
  nextProduction: number
}

export const BuildingDetailsMetadataProduction: React.FC<Props> = ({ currentProduction, nextProduction }) => {
  return <>
    <p>
      Production actuelle: <strong>{transformHourlyEarnings(currentProduction)}</strong><br />
      Production suivante: <strong>{transformHourlyEarnings(nextProduction)}</strong>
    </p>
  </>
}
