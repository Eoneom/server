import React from 'react'

import { Movement } from '#types'
import { LayoutDetailsContent } from '#ui/layout/details/content'
import { TroopTranslations } from '#troop/translations'
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

    <h3>Troopes</h3>
    <ul>
      {movement.troops.map(troop => {
        const { name } = TroopTranslations[troop.code]
        return <li key={troop.code}>{name} {troop.count}</li>
      })}
    </ul>
  </LayoutDetailsContent>
}
