import { selectCityCoordinates } from '#city/slice'
import { useAppDispatch, useAppSelector } from '#store/type'
import { MovementCreateAction } from './action'
import { MovementCreateDestination } from './destination'
import { MovementCreateEstimation } from './estimation'
import { MovementCreateTroops } from './troops'
import { MovementCreateWarning } from './warning'
import { MovementEstimation } from '#types'
import { Coordinates, MovementAction, OutpostType, TroopCode } from '@eoneom/api-client'
import React, { useEffect, useState } from 'react'
import { selectOutpost } from '#outpost/slice'
import { selectTroops } from '#troop/slice'
import { estimateMovement } from '../api/estimate'
import { selectToken } from '#auth/slice'
import { createMovement } from '#troop/slice/thunk'

export const MovementCreate: React.FC = () => {
  const dispatch = useAppDispatch()
  const troops = useAppSelector(selectTroops)
  const outpost = useAppSelector(selectOutpost)
  const cityCoordinates = useAppSelector(selectCityCoordinates)
  const token = useAppSelector(selectToken)

  const [ selectedTroops, setSelectedTroops ] = useState<Partial<Record<TroopCode, number>>>({})
  const [ destination, setDestination ] = useState<Coordinates>({ x: 1, y: 1, sector: 1 })
  const [ estimation, setEstimation ] = useState<MovementEstimation>({ speed: 0, duration: 0, distance: 0 })
  const [ action, setAction ] = useState<MovementAction>(MovementAction.BASE)

  useEffect(() => {
    launchMovementEstimation()
  }, [selectedTroops, destination])

  const launchMovementEstimation = async () => {
    if (!token) {
      return
    }

    const origin = cityCoordinates ? cityCoordinates : outpost?.coordinates
    if (!origin) {
      return
    }

    const troopCodes: TroopCode[] = Object.keys(selectedTroops).filter(code => selectedTroops[code as TroopCode]).map(code => code as TroopCode)
    if (!troopCodes.length) {
      return
    }

    const result = await estimateMovement({ token, origin, destination, troopCodes })
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

    const moveTroops = Object.keys(selectedTroops).reduce((acc, key) => {
      const code = key as TroopCode
      if (selectedTroops[code]) {
        return [...acc, {code, count: selectedTroops[code] ?? 0}]
      }

      return acc
    }, new Array<{ code: TroopCode, count: number }>())

    if (!moveTroops.length) {
      return
    }

    dispatch(createMovement({ action, origin, destination, troops: moveTroops }))
  }

  return (
    <form
      id="movement-creation"
      className="movement-create-form"
      onSubmit={event => onSubmit(event)}
    >
      <section className="movement-panel movement-panel--create">
        <h2 className="movement-panel__title">Nouveau déplacement</h2>
        <p className="movement-panel__lede">
          Choisissez les troupes, l&apos;ordre et la case cible : l&apos;estimation se met à jour
          automatiquement avant l&apos;envoi.
        </p>
        <div className="movement-create-grid">
          <div id="troop-selection" className="movement-create-grid__col movement-create-grid__col--troops">
            <h3 className="movement-subsection__title">Troupes à envoyer</h3>
            <MovementCreateTroops
              troops={troops}
              selectedTroops={selectedTroops}
              onChange={setSelectedTroops}
            />
          </div>
          <div id="movement-submit" className="movement-create-grid__col movement-create-grid__col--config">
            <div className="movement-config-stack">
              <MovementCreateAction action={action} onChange={setAction} />
              <MovementCreateDestination destination={destination} onChange={setDestination} />
              <MovementCreateEstimation estimation={estimation} />
            </div>
          </div>
        </div>
        <div className="movement-submit-footer">
          <MovementCreateWarning
            isTemporaryOutpost={Boolean(outpost?.type === OutpostType.TEMPORARY)}
            troops={troops}
            selectedTroops={selectedTroops}
          />
          <input
            className="movement-submit-button"
            disabled={!estimation.distance}
            type="submit"
            value="Envoyer le déplacement"
          />
        </div>
      </section>
    </form>
  )
}
