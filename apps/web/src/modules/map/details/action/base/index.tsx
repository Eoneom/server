import React, { useState } from 'react'

import { MovementAction, TroopCode } from '@eoneom/api-client'

import { useGetCity } from '#city/hooks'
import { useGetOutpost } from '#outpost/hooks'
import { useListTroops, useCreateMovement } from '#troop/hooks'
import { TroopTranslations } from '#troop/translations'
import { Button } from '#ui/button'

type Props =
  | { cityId: string; outpostId?: never }
  | { cityId?: never; outpostId: string }
interface BaseProps {
  coordinates: {
    x: number
    y: number
    sector: number
  }
}

export const MapDetailsActionBase: React.FC<Props & BaseProps> = ({ cityId, outpostId, coordinates }) => {
  const { data: city } = useGetCity(cityId)
  const { data: outpost } = useGetOutpost(outpostId)
  const { data: troops = [] } = useListTroops(cityId ? { cityId } : { outpostId: outpostId as string })
  const createMovement = useCreateMovement()

  const [troopsToBase, setTroopsToBase] = useState<Partial<Record<TroopCode, number>>>({})

  const handleBase = () => {
    const origin = city?.coordinates ?? outpost?.coordinates
    if (!origin) return

    const finalTroops = Object.entries(troopsToBase)
      .filter(([, value]) => value)
      .map(([key, value]) => ({
        code: key as TroopCode,
        count: value as number
      }))

    if (!finalTroops.length) return

    createMovement.mutate({
      action: MovementAction.BASE,
      origin,
      destination: coordinates,
      troops: finalTroops
    })
  }

  return (
    <div className="details-block">
      <h3>Troupes à baser</h3>
      <ul className="details-troop-list">
        {troops.map(troop => {
          const { name } = TroopTranslations[troop.code]
          return (
            <li key={troop.code}>
              <span>{name}</span>
              <input
                type="number"
                min={0}
                max={troop.count}
                placeholder="0"
                onChange={event =>
                  setTroopsToBase({
                    ...troopsToBase,
                    [troop.code]: event.target.value,
                  })
                }
              />
              <span className="details-meta">/ {troop.count}</span>
            </li>
          )
        })}
      </ul>
      <Button onClick={handleBase}>Baser</Button>
    </div>
  )
}
