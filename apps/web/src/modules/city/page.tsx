import React  from 'react'
import { formatCoordinates } from '#helpers/transform'
import { selectCity } from '#city/slice'
import { useAppSelector } from '#store/type'

export const CityPage: React.FC = () => {
  const city = useAppSelector(selectCity)

  return city && <section id="content">
    <h2>{city.name}</h2>
    <h3>
        Coordonnées: {formatCoordinates(city.coordinates)}
    </h3>
  </section>
}
