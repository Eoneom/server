import React, { useEffect } from 'react'
import { TechnologyList } from '#technology/list'
import { TechnologyDetails } from '#technology/details/index'
import { LayoutPage } from '#ui/layout/page'
import { useAppDispatch, useAppSelector } from '#store/type'
import { listTechnologies } from '#technology/slice/thunk'
import {  selectCityId } from '#city/slice'
import { listBuildings } from '#building/slice/thunk'
import { selectTechnology } from '#technology/slice'

export const TechnologyPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const cityId = useAppSelector(selectCityId)
  const technology = useAppSelector(selectTechnology)

  useEffect(() => {
    if (!cityId) {
      return
    }

    dispatch(listTechnologies())
    dispatch(listBuildings())
  }, [cityId])

  return <LayoutPage details={technology && <TechnologyDetails technology={technology}/>}>
    <TechnologyList />
  </LayoutPage>
}
