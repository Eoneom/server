import React, { useState } from 'react'

import { MovementAction, TroupCode } from '@kroust/swarm-client'

import { selectCityCoordinates } from '#city/slice'
import { selectOutpostCoordinates } from '#outpost/slice'
import { useAppDispatch, useAppSelector } from '#store/type'
import { selectTroups } from '#troup/slice'
import { createMovement } from '#troup/slice/thunk'
import { TroupTranslations } from '#troup/translations'
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

  const troups = useAppSelector(selectTroups)
  const cityCoordinates = useAppSelector(selectCityCoordinates)
  const outpostCoordinates = useAppSelector(selectOutpostCoordinates)

  const [troupsToBase, setTroupsToBase] = useState<Partial<Record<TroupCode, number>>>({})

  const handleBase = () => {
    const origin = cityCoordinates ?? outpostCoordinates
    if (!origin) {
      return
    }

    const finalTroups = Object.entries(troupsToBase)
      .filter(([, value]) => value)
      .map(([key, value]) => {
        return {
          code: key as TroupCode,
          count: value
        }
      })

    if (!finalTroups.length) {
      return
    }

    dispatch(createMovement({
      action: MovementAction.BASE,
      origin,
      destination: coordinates,
      troups: finalTroups
    }))
  }

  return  <>
    <ul>
      {troups.map(troup => {
        const {name} = TroupTranslations[troup.code]
        return <li key={troup.code}>
          {name}
          <input type="number" max={troup.count} onChange={event => setTroupsToBase({
            ...troupsToBase,
            [troup.code]: event.target.value
          })} /> / {troup.count}
          <br />
        </li>
      })}
    </ul>
    <Button onClick={handleBase}>Baser</Button>
  </>
}
