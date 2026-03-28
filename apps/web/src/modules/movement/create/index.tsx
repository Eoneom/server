import { selectCityCoordinates } from '#city/slice'
import { useAppDispatch, useAppSelector } from '#store/type'
import { MovementCreateAction } from './action'
import { MovementCreateDestination } from './destination'
import { MovementCreateEstimation } from './estimation'
import { MovementCreateTroups } from './troups'
import { MovementCreateWarning } from './warning'
import { MovementEstimation } from '#types'
import { Coordinates, MovementAction, OutpostType, TroupCode } from '@kroust/swarm-client'
import React, { useEffect, useState } from 'react'
import { selectOutpost } from '#outpost/slice'
import { selectTroups } from '#troup/slice'
import { estimateMovement } from '../api/estimate'
import { selectToken } from '#auth/slice'
import { createMovement } from '#troup/slice/thunk'

export const MovementCreate: React.FC = () => {
  const dispatch = useAppDispatch()
  const troups = useAppSelector(selectTroups)
  const outpost = useAppSelector(selectOutpost)
  const cityCoordinates = useAppSelector(selectCityCoordinates)
  const token = useAppSelector(selectToken)

  const [ selectedTroups, setSelectedTroups ] = useState<Partial<Record<TroupCode, number>>>({})
  const [ destination, setDestination ] = useState<Coordinates>({ x: 1, y: 1, sector: 1 })
  const [ estimation, setEstimation ] = useState<MovementEstimation>({ speed: 0, duration: 0, distance: 0 })
  const [ action, setAction ] = useState<MovementAction>(MovementAction.BASE)

  useEffect(() => {
    launchMovementEstimation()
  }, [selectedTroups, destination])

  const launchMovementEstimation = async () => {
    if (!token) {
      return
    }

    const origin = cityCoordinates ? cityCoordinates : outpost?.coordinates
    if (!origin) {
      return
    }

    const troupCodes: TroupCode[] = Object.keys(selectedTroups).filter(code => selectedTroups[code as TroupCode]).map(code => code as TroupCode)
    if (!troupCodes.length) {
      return
    }

    const result = await estimateMovement({ token, origin, destination, troupCodes })
    if (!result) {
      setEstimation({
        speed: 0,
        duration: 0,
        distance: 0
      })

      return
    }

    setEstimation(result)
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const origin = cityCoordinates ? cityCoordinates : outpost?.coordinates
    if (!origin) {
      return
    }

    const moveTroups = Object.keys(selectedTroups).reduce((acc, key) => {
      const code = key as TroupCode
      if (selectedTroups[code]) {
        return [...acc, {code, count: selectedTroups[code] ?? 0}]
      }

      return acc
    }, new Array<{ code: TroupCode, count: number }>())

    if (!moveTroups.length) {
      return
    }

    dispatch(createMovement({ action, origin, destination, troups: moveTroups }))
  }

  return <form id="movement-creation" onSubmit={(event) => onSubmit(event)}>
    <div id="troup-selection">
      <h2>Troupes à envoyer</h2>
      <MovementCreateTroups
        troups={troups}
        selectedTroups={selectedTroups}
        onChange={setSelectedTroups}
      />
    </div>
    <div id="movement-submit">
      <h2>Déplacement</h2>
      <MovementCreateAction
        action={action}
        onChange={setAction}
      />
      <MovementCreateDestination
        destination={destination}
        onChange={setDestination}
      />
      <MovementCreateEstimation estimation={estimation}/>

      <MovementCreateWarning
        isTemporaryOutpost={Boolean(outpost?.type === OutpostType.TEMPORARY)}
        troups={troups}
        selectedTroups={selectedTroups}
      /><br />
      <input disabled={!estimation.distance} type="submit" value="Envoyer" />
    </div>
  </form>
}
