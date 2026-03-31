import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { MemoryRouter } from 'react-router-dom'

import { authSliceReducer } from '#auth/slice'
import { buildingSliceReducer } from '#building/slice'
import { citySliceReducer } from '#city/slice'
import { reportSliceReducer } from '#communication/report/slice'
import { outpostSliceReducer } from '#outpost/slice'
import { technologySliceReducer } from '#technology/slice'
import { troopSliceReducer } from '#troop/slice'
import type { RootState } from '#store/index'
import type { City } from '#types'
import type { Outpost } from '#types'
import { OutpostType } from '@server-core/outpost/constant/type'

import { Header } from './index'

const minimalCity = (overrides: Partial<City> = {}): City => ({
  id: 'city-1',
  name: 'Testville',
  plastic: 10,
  mushroom: 20,
  maximum_building_levels: 5,
  building_levels_used: 1,
  coordinates: { sector: 1, x: 2, y: 3 },
  earnings_per_second: { plastic: 0.1, mushroom: 0.2 },
  pre_cell_earnings_per_second: { plastic: 0.1, mushroom: 0.2 },
  cell_resource_coefficient: { plastic: 1, mushroom: 1 },
  warehouses_capacity: { plastic: 1000, mushroom: 1000 },
  warehouse_space_remaining: { plastic: 900, mushroom: 800 },
  warehouse_full_in_seconds: { plastic: 0, mushroom: 0 },
  ...overrides,
})

const minimalOutpost = (overrides: Partial<Outpost> = {}): Outpost => ({
  id: 'out-1',
  coordinates: { sector: 5, x: 6, y: 7 },
  type: OutpostType.TEMPORARY,
  plastic: 0,
  mushroom: 0,
  ...overrides,
})

const headerTestRootReducer = combineReducers({
  auth: authSliceReducer,
  building: buildingSliceReducer,
  city: citySliceReducer,
  outpost: outpostSliceReducer,
  report: reportSliceReducer,
  technology: technologySliceReducer,
  troop: troopSliceReducer,
})

function createTestStore(partial?: Partial<RootState>) {
  return configureStore({
    reducer: headerTestRootReducer,
    preloadedState: partial,
  })
}

function renderHeader(partial?: Partial<RootState>) {
  const store = createTestStore(partial)
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    </Provider>,
  )
}

describe('Header', () => {
  it('renders brand heading', () => {
    renderHeader()
    expect(screen.getByRole('heading', { level: 3, name: 'Eoneom' })).toBeInTheDocument()
  })

  it('shows city name and city link when city is set', () => {
    const city = minimalCity({ id: 'c-99', name: 'Metro' })
    renderHeader({
      city: { city, cities: [], cities_count_limit: 0 },
    })
    const link = screen.getByRole('link', { name: 'Metro' })
    expect(link).toHaveAttribute('href', '/city/c-99')
  })

  it('shows formatted coordinates and outpost link when only outpost is set', () => {
    renderHeader({
      outpost: {
        outpost: minimalOutpost({ id: 'o-42', coordinates: { sector: 3, x: 1, y: 9 } }),
        outposts: [],
      },
    })
    const link = screen.getByRole('link', { name: '3.1.9' })
    expect(link).toHaveAttribute('href', '/outpost/o-42')
  })

  it('prefers city over outpost for title and link', () => {
    renderHeader({
      city: { city: minimalCity({ id: 'c-1', name: 'OnlyCity' }), cities: [], cities_count_limit: 0 },
      outpost: {
        outpost: minimalOutpost({ id: 'o-9' }),
        outposts: [],
      },
    })
    expect(screen.getByRole('link', { name: 'OnlyCity' })).toHaveAttribute('href', '/city/c-1')
  })

  it('when neither city nor outpost, title link is empty and href is /outpost/undefined', () => {
    renderHeader()
    const link = screen.getByRole('link')
    expect(link).toHaveTextContent('')
    expect(link).toHaveAttribute('href', '/outpost/undefined')
  })

  it('with city, shows resource progress bars', () => {
    renderHeader({
      city: { city: minimalCity(), cities: [], cities_count_limit: 0 },
    })
    expect(screen.getAllByRole('progressbar')).toHaveLength(2)
  })
})
