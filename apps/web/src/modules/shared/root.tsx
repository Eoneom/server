import { selectAllCities, selectCityId } from '#city/slice'
import { getCity } from '#city/slice/thunk'
import { selectOutpostId } from '#outpost/slice'
import { useAppDispatch, useAppSelector } from '#store/type'
import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

export const SharedRoot: React.FC = () => {
  const cities = useAppSelector(selectAllCities)
  const cityId = useAppSelector(selectCityId)
  const outpostId = useAppSelector(selectOutpostId)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (cityId || outpostId) {
      return
    }

    if (!cities.length) {
      return
    }

    dispatch(getCity(cities[0].id))
  }, [cityId, outpostId, cities])
  return <Outlet />
}
