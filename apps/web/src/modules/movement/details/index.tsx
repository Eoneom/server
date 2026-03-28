import React from 'react'

import { Movement } from '#types'
import { LayoutDetailsContent } from '#ui/layout/details/content'
import { TroupTranslations } from '#troup/translations'
import { formatCoordinates } from '#helpers/transform'

interface Props {
  movement: Movement
}

export const MovementDetails: React.FC<Props> = ({ movement }) => {
  return <LayoutDetailsContent>
    <h2>{movement.action}</h2>
    <p>
      Arrive à {`${new Date(movement.arrive_at).toLocaleString()}`}<br />
      Départ : {formatCoordinates(movement.origin)}<br />
      Arrivée : {formatCoordinates(movement.destination)}
    </p>

    <h3>Troupes</h3>
    <ul>
      {movement.troups.map(troup => {
        const { name } = TroupTranslations[troup.code]
        return <li key={troup.code}>{name} {troup.count}</li>
      })}
    </ul>
  </LayoutDetailsContent>
}
