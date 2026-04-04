import React, { useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'

import { useLocation } from '#location/context'
import { useGameStateRefresh } from '#game/hooks'

export const CityRoot: React.FC = () => {
  const { cityId } = useParams()
  const { setCity } = useLocation()

  useEffect(() => {
    if (!cityId) return
    setCity(cityId)
  }, [cityId, setCity])

  useGameStateRefresh(cityId)

  return <Outlet />
}
