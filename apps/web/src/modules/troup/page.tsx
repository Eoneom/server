import React, { useEffect } from 'react'

import { LayoutPage } from '#ui/layout/page'
import { TroupList } from '#troup/list'
import { TroupDetails } from '#troup/details'
import { useAppDispatch, useAppSelector } from '#store/type'
import { selectCityId } from '#city/slice'
import { listBuildings } from '#building/slice/thunk'
import { listTroups } from '#troup/slice/thunk'
import { selectTroup } from '#troup/slice'

export const TroupPage: React.FC = () => {
  const dispatch = useAppDispatch()

  const troup = useAppSelector(selectTroup)
  const cityId = useAppSelector(selectCityId)

  useEffect(() => {
    if (!cityId) {
      return
    }

    dispatch(listTroups())
    dispatch(listBuildings())
  }, [cityId])

  return <LayoutPage details={troup && <TroupDetails />}>
    <TroupList />
  </LayoutPage>
}
