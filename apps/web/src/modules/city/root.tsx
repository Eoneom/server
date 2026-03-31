import { selectCityId } from '#city/slice'
import { getCity } from '#city/slice/thunk'
import { refreshGameState } from '#game/refresh-state/thunk'
import { useAppDispatch, useAppSelector } from '#store/type'
import React, { useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'

export const CityRoot: React.FC = () => {
  const { cityId: cityIdFromParams } = useParams()
  const cityId = useAppSelector(selectCityId)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!cityIdFromParams) {
      return
    }

    dispatch(getCity(cityIdFromParams))
  }, [cityIdFromParams])

  useEffect(() => {
    dispatch(refreshGameState())

    const interval = setInterval(() => {
      dispatch(refreshGameState())
    }, 3000)

    return () => clearInterval(interval)
  }, [cityId])

  return <Outlet />
}
