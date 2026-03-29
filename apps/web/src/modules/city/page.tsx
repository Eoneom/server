import React from 'react'
import { useParams } from 'react-router-dom'

import {
  formatCoordinates,
  transformDecimals,
  transformHourlyEarnings
} from '#helpers/transform'
import { selectCity } from '#city/slice'
import { useAppSelector } from '#store/type'
import { IconMushroom } from '#ui/icon/mushroom'
import { IconPlastic } from '#ui/icon/plastic'

const formatTerrainCoeff = (value: number): string => {
  return `×${value.toFixed(2)}`
}

const warehouseFillPercent = (capacity: number, spaceRemaining: number): number => {
  if (capacity <= 0) {
    return 0
  }

  const used = capacity - spaceRemaining

  return Math.min(100, Math.max(0, (used / capacity) * 100))
}

export const CityPage: React.FC = () => {
  const { cityId: cityIdFromParams } = useParams()
  const city = useAppSelector(selectCity)

  if (!cityIdFromParams) {
    return null
  }

  if (!city || city.id !== cityIdFromParams) {
    return (
      <section id="content" className="city-page">
        <p className="city-page__loading">Chargement…</p>
      </section>
    )
  }

  const plasticFill = warehouseFillPercent(
    city.warehouses_capacity.plastic,
    city.warehouse_space_remaining.plastic
  )
  const mushroomFill = warehouseFillPercent(
    city.warehouses_capacity.mushroom,
    city.warehouse_space_remaining.mushroom
  )

  return (
    <section id="content" className="city-page">
      <header className="city-page__hero">
        <div className="city-page__hero-main">
          <h1 className="city-page__title">{city.name}</h1>
          <p className="city-page__lede">Vue d’ensemble de votre cité et de ses flux de ressources.</p>
        </div>
        <p className="details-coordinates city-page__coords" title="Position sur la carte">
          {formatCoordinates(city.coordinates)}
        </p>
      </header>

      <div className="city-page__grid">
        <article className="city-panel" aria-labelledby="city-availability-heading">
          <h2 id="city-availability-heading" className="city-panel__title">
            Disponibilité et stockage
          </h2>
          <p className="city-panel__lede">
            Stocks actuels, place libre et capacité maximale (dans les indicateurs ci-dessous).
          </p>
          <h3 className="city-subheading">Ressources en stock</h3>
          <ul className="app-list app-list--kv city-panel__list">
            <li>
              <span className="city-panel__kv-label">
                <IconPlastic /> Plastique (stock)
              </span>
              <span>{transformDecimals(city.plastic)}</span>
            </li>
            <li>
              <span className="city-panel__kv-label">
                <IconMushroom /> Champignon (stock)
              </span>
              <span>{transformDecimals(city.mushroom)}</span>
            </li>
          </ul>
          <h3 className="city-subheading">Entrepôts</h3>
          <div className="city-warehouse-bars">
            <div className="city-warehouse-bars__item">
              <div className="city-warehouse-bars__row">
                <span className="city-warehouse-bars__label">
                  <IconPlastic /> Entrepôt plastique
                </span>
                <span className="city-warehouse-bars__meta">
                  {transformDecimals(city.warehouse_space_remaining.plastic)} libre /{' '}
                  {transformDecimals(city.warehouses_capacity.plastic)}
                </span>
              </div>
              <progress
                value={plasticFill}
                max={100}
                className={plasticFill >= 90 ? 'warn' : ''}
                aria-label="Remplissage entrepôt plastique"
              />
            </div>
            <div className="city-warehouse-bars__item">
              <div className="city-warehouse-bars__row">
                <span className="city-warehouse-bars__label">
                  <IconMushroom /> Entrepôt champignon
                </span>
                <span className="city-warehouse-bars__meta">
                  {transformDecimals(city.warehouse_space_remaining.mushroom)} libre /{' '}
                  {transformDecimals(city.warehouses_capacity.mushroom)}
                </span>
              </div>
              <progress
                value={mushroomFill}
                max={100}
                className={mushroomFill >= 90 ? 'warn' : ''}
                aria-label="Remplissage entrepôt champignon"
              />
            </div>
          </div>
          <p className="city-panel__footnote">
            Capacité de développement (niveaux de bâtiments cumulés)&nbsp;:{' '}
            <strong>{city.maximum_building_levels}</strong>
          </p>
        </article>

        <article className="city-panel" aria-labelledby="city-production-heading">
          <h2 id="city-production-heading" className="city-panel__title">
            Production et terrain
          </h2>
          <p className="city-panel__lede">
            Débits par heure. Les multiplicateurs de cellule s’appliquent à la production «&nbsp;actuelle&nbsp;».
          </p>
          <h3 className="city-subheading">Actuelle (avec terrain)</h3>
          <ul className="app-list app-list--kv city-panel__list">
            <li>
              <span className="city-panel__kv-label">
                <IconPlastic /> Plastique
              </span>
              <span>{transformHourlyEarnings(city.earnings_per_second.plastic)}</span>
            </li>
            <li>
              <span className="city-panel__kv-label">
                <IconMushroom /> Champignon
              </span>
              <span>{transformHourlyEarnings(city.earnings_per_second.mushroom)}</span>
            </li>
          </ul>
          <h3 className="city-subheading">Base des bâtiments (avant terrain)</h3>
          <ul className="app-list app-list--kv city-panel__list">
            <li>
              <span className="city-panel__kv-label">
                <IconPlastic /> Plastique
              </span>
              <span>{transformHourlyEarnings(city.pre_cell_earnings_per_second.plastic)}</span>
            </li>
            <li>
              <span className="city-panel__kv-label">
                <IconMushroom /> Champignon
              </span>
              <span>{transformHourlyEarnings(city.pre_cell_earnings_per_second.mushroom)}</span>
            </li>
          </ul>
          <h3 className="city-subheading" id="city-coeff-subheading">
            Coefficients de terrain (cellule)
          </h3>
          <p className="city-panel__coeff-hint" id="city-coeff-hint">
            Multiplicateurs de la cellule où se trouve la cité.
          </p>
          <div
            className="city-coeff-chips"
            aria-labelledby="city-coeff-subheading"
            aria-describedby="city-coeff-hint"
          >
            <span className="city-coeff-chip">
              <IconPlastic /> {formatTerrainCoeff(city.cell_resource_coefficient.plastic)}
            </span>
            <span className="city-coeff-chip">
              <IconMushroom /> {formatTerrainCoeff(city.cell_resource_coefficient.mushroom)}
            </span>
          </div>
        </article>
      </div>
    </section>
  )
}
