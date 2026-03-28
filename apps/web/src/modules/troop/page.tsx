import React, { useEffect } from 'react'

import { LayoutPage } from '#ui/layout/page'
import { TroopList } from '#troop/list'
import { TroopDetails } from '#troop/details'
import { useAppDispatch, useAppSelector } from '#store/type'
import { selectCityId } from '#city/slice'
import { listBuildings } from '#building/slice/thunk'
import { listTroops } from '#troop/slice/thunk'
import { selectTroop } from '#troop/slice'

export const TroopPage: React.FC = () => {
  const dispatch = useAppDispatch()

  const troop = useAppSelector(selectTroop)
  const cityId = useAppSelector(selectCityId)

  useEffect(() => {
    if (!cityId) {
      return
    }

    dispatch(listTroops())
    dispatch(listBuildings())
  }, [cityId])

  return <LayoutPage details={troop && <TroopDetails />}>
    <TroopList />
  </LayoutPage>
}
