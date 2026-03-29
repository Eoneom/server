import React, { useState } from 'react'

import { MovementAction, TroopCode } from '@eoneom/api-client'

import { selectCityCoordinates } from '#city/slice'
import { selectOutpostCoordinates } from '#outpost/slice'
import { useAppDispatch, useAppSelector } from '#store/type'
import { selectTroops } from '#troop/slice'
import { createMovement } from '#troop/slice/thunk'
import { TroopTranslations } from '#troop/translations'
import { Button } from '#ui/button'

interface Props {
  coordinates: {
    x: number
    y: number
    sector: number
  }
}

export const MapDetailsActionBase: React.FC<Props> = ({ coordinates }) => {
  const dispatch = useAppDispatch()

  const troops = useAppSelector(selectTroops)
  const cityCoordinates = useAppSelector(selectCityCoordinates)
  const outpostCoordinates = useAppSelector(selectOutpostCoordinates)

  const [troopsToBase, setTroopsToBase] = useState<Partial<Record<TroopCode, number>>>({})

  const handleBase = () => {
    const origin = cityCoordinates ?? outpostCoordinates
    if (!origin) {
      return
    }

    const finalTroops = Object.entries(troopsToBase)
      .filter(([, value]) => value)
      .map(([key, value]) => {
        return {
          code: key as TroopCode,
          count: value
        }
      })

    if (!finalTroops.length) {
      return
    }

    dispatch(createMovement({
      action: MovementAction.BASE,
      origin,
      destination: coordinates,
      troops: finalTroops
    }))
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
