import { TroupCode } from '@kroust/swarm-client'
import React from 'react'

interface Props {
  isTemporaryOutpost: boolean
  troups: {
    code: TroupCode
    count: number
  }[]
  selectedTroups: Partial<Record<TroupCode, number>>
}

export const MovementCreateWarning: React.FC<Props> = ({ isTemporaryOutpost, troups, selectedTroups }) => {
  if (!isTemporaryOutpost) {
    return null
  }

  const isAllTroupsTaken = troups.every(troup => {
    return troup.count === (selectedTroups[troup.code] ?? 0)
  })

  if (!isAllTroupsTaken) {
    return null
  }

  return <strong>{'Attention, ce déplacement va supprimer l\'avant poste temporaire'}</strong>
}
