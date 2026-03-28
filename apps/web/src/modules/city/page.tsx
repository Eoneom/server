import React from 'react'
import { useParams } from 'react-router-dom'

import {
  formatCoordinates,
  transformDecimals,
  transformHourlyEarnings
} from '#helpers/transform'
import { selectCity } from '#city/slice'
import { useAppSelector } from '#store/type'

const formatTerrainCoeff = (value: number): string => {
  return `×${value.toFixed(2)}`
}

export const CityPage: React.FC = () => {
  const { cityId: cityIdFromParams } = useParams()
  const city = useAppSelector(selectCity)

  if (!cityIdFromParams) {
    return null
  }

  if (!city || city.id !== cityIdFromParams) {
    return <section id="content">
      <p>Chargement…</p>
    </section>
  }

  return <section id="content">
    <h2>{city.name}</h2>

    <section aria-labelledby="city-storage-heading">
      <h3 id="city-storage-heading">Capacité de stockage</h3>
      <p>
        Plastique : <strong>{transformDecimals(city.warehouses_capacity.plastic)}</strong><br />
        Champignon : <strong>{transformDecimals(city.warehouses_capacity.mushroom)}</strong>
      </p>
    </section>

    <section aria-labelledby="city-production-heading">
      <h3 id="city-production-heading">Production actuelle</h3>
      <p>
        Plastique : <strong>{transformHourlyEarnings(city.earnings_per_second.plastic)}</strong><br />
        Champignon : <strong>{transformHourlyEarnings(city.earnings_per_second.mushroom)}</strong>
      </p>
    </section>

    <section aria-labelledby="city-coeff-heading">
      <h3 id="city-coeff-heading">Coefficients de production</h3>
      <p>
        Multiplicateurs de terrain (cellule) — plastique {formatTerrainCoeff(city.cell_resource_coefficient.plastic)},
        champignon {formatTerrainCoeff(city.cell_resource_coefficient.mushroom)}
      </p>
      <p>
        Production de base des bâtiments (avant terrain) — plastique{' '}
        <strong>{transformHourlyEarnings(city.pre_cell_earnings_per_second.plastic)}</strong>,
        champignon{' '}
        <strong>{transformHourlyEarnings(city.pre_cell_earnings_per_second.mushroom)}</strong>
      </p>
    </section>

    <section aria-labelledby="city-availability-heading">
      <h3 id="city-availability-heading">Disponibilité</h3>
      <p>
        Stocks — plastique : <strong>{transformDecimals(city.plastic)}</strong>,
        champignon : <strong>{transformDecimals(city.mushroom)}</strong>
      </p>
      <p>
        Place restante en entrepôt — plastique :{' '}
        <strong>{transformDecimals(city.warehouse_space_remaining.plastic)}</strong>,
        champignon :{' '}
        <strong>{transformDecimals(city.warehouse_space_remaining.mushroom)}</strong>
      </p>
      <p>
        Capacité de développement (niveaux de bâtiments cumulés) :{' '}
        <strong>{city.maximum_building_levels}</strong>
      </p>
    </section>

    <section aria-labelledby="city-coords-heading">
      <h3 id="city-coords-heading">Coordonnées</h3>
      <p>{formatCoordinates(city.coordinates)}</p>
    </section>
  </section>
}
