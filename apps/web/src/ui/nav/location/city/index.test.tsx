import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { NavLocationCities } from './index'

const cities = [
  { id: 'c1', name: 'Alpha' },
  { id: 'c2', name: 'Beta' },
]

describe('NavLocationCities', () => {
  it('renders Villes heading with current count and limit', () => {
    render(
      <MemoryRouter>
        <NavLocationCities cities={cities} countLimit={5} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Villes 2/5')
  })

  it('renders a link for each city', () => {
    render(
      <MemoryRouter>
        <NavLocationCities cities={cities} countLimit={5} />
      </MemoryRouter>,
    )

    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(2)
    expect(links[0]).toHaveTextContent('Alpha')
    expect(links[0]).toHaveAttribute('href', '/city/c1')
    expect(links[1]).toHaveTextContent('Beta')
    expect(links[1]).toHaveAttribute('href', '/city/c2')
  })
})
