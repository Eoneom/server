import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { HeaderTitle } from './index'

describe('HeaderTitle', () => {
  it('renders link with text and href from props', () => {
    render(
      <MemoryRouter>
        <HeaderTitle to='/city/abc' text='My City' />
      </MemoryRouter>,
    )
    const link = screen.getByRole('link', { name: 'My City' })
    expect(link).toHaveAttribute('href', '/city/abc')
  })

  it('renders empty link when text is empty', () => {
    render(
      <MemoryRouter>
        <HeaderTitle to='/outpost/x' text='' />
      </MemoryRouter>,
    )
    const link = screen.getByRole('link')
    expect(link).toHaveTextContent('')
    expect(link).toHaveAttribute('href', '/outpost/x')
  })
})
