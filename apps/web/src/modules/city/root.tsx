import React, { useEffect } from 'react'
import { Outlet } from '@tanstack/react-router'

import { useLocation } from '#location/context'
import { useGameStateRefresh } from '#game/hooks'

type CityRootProps = {
  cityId: string
}

export const CityRoot: React.FC<CityRootProps> = ({ cityId }) => {
  const { setCity } = useLocation()

  useEffect(() => {
    setCity(cityId)
  }, [cityId, setCity])

  useGameStateRefresh(cityId)

  return <Outlet />
}
