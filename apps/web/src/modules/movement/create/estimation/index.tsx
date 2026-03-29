import React from 'react'

import { formatTime } from '#helpers/transform'
import { MovementEstimation } from '#types'

interface Props {
  estimation: MovementEstimation
}

export const MovementCreateEstimation: React.FC<Props> = ({ estimation }) => {
  if (!estimation.distance) {
    return <>Destination non trouvée ou aucune troupe à envoyer</>
  }

  return <ul>
    <li>
      <span>Distance</span>
      <span>{estimation.distance}</span>
    </li>
    <li>
      <span>Vitesse des troupes</span>
      <span>{estimation.speed}</span>
    </li>
    <li>
      <span>Durée</span>
      <span>{formatTime(Math.ceil(estimation.duration))}</span>
    </li>
    <li>
      <span>Heure d&apos;arrivée</span>
      <span>{`${new Date(new Date().getTime() + estimation.duration).toLocaleString()}`}</span>
    </li>
  </ul>
}
