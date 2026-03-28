import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { LayoutPage } from '#ui/layout/page'
import { MovementList } from '#movement/list'
import { MovementDetails } from '#movement/details'
import { MovementCreate } from '#movement/create'
import { useAppDispatch, useAppSelector } from '#store/type'
import {  selectCityId } from '#city/slice'
import { selectOutpostId } from '#outpost/slice'
import { getMovement, listTroops } from '#troop/slice/thunk'
import { resetMovement, selectMovement } from '#troop/slice'

export const MovementPage: React.FC = () => {
  const { movementId } = useParams()
  const dispatch = useAppDispatch()
  const movement = useAppSelector(selectMovement)
  const cityId = useAppSelector(selectCityId)
  const outpostId = useAppSelector(selectOutpostId)

  useEffect(() => {
    if (!cityId && !outpostId) {
      return
    }

    dispatch(listTroops())
  }, [cityId, outpostId])

  useEffect(() => {
    if (!movementId) {
      dispatch(resetMovement())
      return
    }

    dispatch(getMovement(movementId))
  }, [movementId])

  return <LayoutPage details={movement && <MovementDetails movement={movement}/>}>
    <MovementCreate />
    <MovementList />
  </LayoutPage>
}
