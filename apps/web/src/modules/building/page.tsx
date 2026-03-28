import { BuildingList } from '#building/list'
import { BuildingDetails } from '#building/details'
import { LayoutPage } from '#ui/layout/page'
import React, { useEffect } from 'react'
import { selectCityId } from '#city/slice'
import { useAppDispatch, useAppSelector } from '#store/type'
import { listTechnologies } from '#technology/slice/thunk'
import { listBuildings } from '#building/slice/thunk'
import { selectBuilding } from '#building/slice'

export const BuildingPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const cityId = useAppSelector(selectCityId)
  const building = useAppSelector(selectBuilding)

  useEffect(() => {
    dispatch(listBuildings())
    dispatch(listTechnologies())
  }, [cityId])

  return <LayoutPage details={building && <BuildingDetails building={building}/>}>
    <BuildingList />
  </LayoutPage>
}
