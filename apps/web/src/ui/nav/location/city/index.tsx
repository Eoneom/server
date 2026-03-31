import React from 'react'

import { CityItem } from '#types'
import { NavLocationItem } from '#ui/nav/location/item'

interface Props {
  cities: CityItem[]
  countLimit: number
}

export const NavLocationCities: React.FC<Props> = ({ cities, countLimit }) => {
  return (
    <section className="nav-location-section">
      <h3>Villes {cities.length}/{countLimit}</h3>
      <ul>
        {cities.map(city => (
          <NavLocationItem key={city.id} to={`/city/${city.id}`} text={city.name} />
        ))}
      </ul>
    </section>
  )
}
