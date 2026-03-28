import { TroopCode } from '@eoneom/api-client'
import React from 'react'

interface Props {
  isTemporaryOutpost: boolean
  troops: {
    code: TroopCode
    count: number
  }[]
  selectedTroops: Partial<Record<TroopCode, number>>
}

export const MovementCreateWarning: React.FC<Props> = ({ isTemporaryOutpost, troops, selectedTroops }) => {
  if (!isTemporaryOutpost) {
    return null
  }

  const isAllTroopsTaken = troops.every(troop => {
    return troop.count === (selectedTroops[troop.code] ?? 0)
  })

  if (!isAllTroopsTaken) {
    return null
  }

  return <strong>{'Attention, ce déplacement va supprimer l\'avant poste temporaire'}</strong>
}
