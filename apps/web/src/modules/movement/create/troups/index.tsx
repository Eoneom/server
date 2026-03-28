import { MovementCreateTroupsInput } from '#movement/create/troups/input'
import { TroupTranslations } from '#troup/translations'
import { TroupItem } from '#types'
import { TroupCode } from '@kroust/swarm-client'
import React from 'react'

interface Props {
  troups: TroupItem[]
  selectedTroups: Partial<Record<TroupCode, number>>
  onChange: (troups: Partial<Record<TroupCode, number>>) => void
}

export const MovementCreateTroups: React.FC<Props> = ({ troups, selectedTroups, onChange }) => {
  return <ul>
    {
      troups.map(troup => {
        const {name} = TroupTranslations[troup.code]
        return <li key={troup.code}>
          {name}
          <MovementCreateTroupsInput
            max={troup.count}
            onChange={value => onChange({
              ...selectedTroups,
              [troup.code]: value
            })}
          /> / {troup.count}
        </li>
      })
    }
  </ul>
}
