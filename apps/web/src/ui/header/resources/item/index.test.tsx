import React from 'react'
import { render, screen, within } from '@testing-library/react'

import { transformDecimals } from '#helpers/transform'

import { HeaderResourcesItem } from './index'

describe('HeaderResourcesItem', () => {
  const baseProps = {
    earnings_per_second: 1,
    warehouse_full_in_seconds: 0,
    icon: <span aria-hidden>icon</span>,
  }

  it('sets progress max to warehouse_capacity', () => {
    render(
      <ul>
        <HeaderResourcesItem
          {...baseProps}
          value={50}
          warehouse_capacity={200}
        />
      </ul>,
    )
    const progress = screen.getByRole('progressbar')
    expect(progress).toHaveAttribute('max', '200')
    expect(progress).toHaveAttribute('value', '50')
  })

  it('does not add warn class on progress when value is below 70% of capacity', () => {
    render(
      <ul>
        <HeaderResourcesItem
          {...baseProps}
          value={50}
          warehouse_capacity={100}
        />
      </ul>,
    )
    const progress = screen.getByRole('progressbar')
    expect(progress.className).not.toContain('warn')
  })

  it('adds warn class on progress when value is at or above 70% of capacity', () => {
    render(
      <ul>
        <HeaderResourcesItem
          {...baseProps}
          value={70}
          warehouse_capacity={100}
        />
      </ul>,
    )
    expect(screen.getByRole('progressbar').className).toContain('warn')
  })

  it('adds danger class on resource item when value is at or above capacity', () => {
    const { container } = render(
      <ul>
        <HeaderResourcesItem
          {...baseProps}
          value={100}
          warehouse_capacity={100}
        />
      </ul>,
    )
    const item = container.querySelector('.resource-item.danger')
    expect(item).toBeInTheDocument()
  })

  it('does not add danger class when below capacity', () => {
    const { container } = render(
      <ul>
        <HeaderResourcesItem
          {...baseProps}
          value={50}
          warehouse_capacity={100}
        />
      </ul>,
    )
    expect(container.querySelector('.resource-item.danger')).not.toBeInTheDocument()
  })

  it('displays transformDecimals output for non-zero value', () => {
    render(
      <ul>
        <HeaderResourcesItem
          {...baseProps}
          value={4242}
          warehouse_capacity={10000}
        />
      </ul>,
    )
    const li = screen.getByRole('listitem')
    expect(within(li).getByText(transformDecimals(4242))).toBeInTheDocument()
  })
})
