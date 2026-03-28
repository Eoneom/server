import { MovementCreateTroopsInput } from '#movement/create/troops/input'
import { TroopTranslations } from '#troop/translations'
import { TroopItem } from '#types'
import { TroopCode } from '@eoneom/api-client'
import React from 'react'

interface Props {
  troops: TroopItem[]
  selectedTroops: Partial<Record<TroopCode, number>>
  onChange: (troops: Partial<Record<TroopCode, number>>) => void
}

export const MovementCreateTroops: React.FC<Props> = ({ troops, selectedTroops, onChange }) => {
  return <ul>
    {
      troops.map(troop => {
        const {name} = TroopTranslations[troop.code]
        return <li key={troop.code}>
          {name}
          <MovementCreateTroopsInput
            max={troop.count}
            onChange={value => onChange({
              ...selectedTroops,
              [troop.code]: value
            })}
          /> / {troop.count}
        </li>
      })
    }
  </ul>
}
