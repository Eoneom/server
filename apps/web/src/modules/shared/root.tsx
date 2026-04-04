import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { useListCities } from '#city/hooks'
import { useLocation } from '#location/context'

export const SharedRoot: React.FC = () => {
  const { cityId, outpostId, setCity } = useLocation()
  const { data: citiesData } = useListCities()
  const navigate = useNavigate()

  useEffect(() => {
    if (cityId || outpostId) return
    const firstCity = citiesData?.cities[0]
    if (!firstCity) return
    setCity(firstCity.id)
    navigate(`/city/${firstCity.id}`)
  }, [cityId, outpostId, citiesData, setCity, navigate])

  return <Outlet />
}
