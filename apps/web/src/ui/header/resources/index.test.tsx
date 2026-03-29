import React from 'react'
import { render, screen } from '@testing-library/react'

import type { City } from '#types'

import { HeaderResources } from './index'

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

describe('HeaderResources', () => {
  it('renders empty list without city', () => {
    render(<HeaderResources city={null} />)
    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('renders two resource rows with progress bars when city is set', () => {
    render(<HeaderResources city={minimalCity()} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getAllByRole('progressbar')).toHaveLength(2)
  })
})
