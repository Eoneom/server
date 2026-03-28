import React from 'react'
import { NavLocationCities } from '#ui/nav/location/city'
import { NavLocationOutposts } from '#ui/nav/location/outpost'
import { useAppSelector } from '#store/type'
import { selectAllCities } from '#city/slice'
import { selectOutposts } from '#outpost/slice'

export const NavLocation: React.FC = () => {
  const cities = useAppSelector(selectAllCities)
  const outposts = useAppSelector(selectOutposts)

  return <nav id="location">
    { Boolean(cities.length) && <NavLocationCities cities={cities} /> }
    { Boolean(outposts.length) && <NavLocationOutposts outposts={outposts} />}
  </nav>
}
