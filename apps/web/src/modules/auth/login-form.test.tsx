import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'

import { AuthLoginForm } from './login-form'
import { store } from '#store/index'

const renderWithStore = (ui: React.ReactElement) =>
  render(<Provider store={store}>{ui}</Provider>)

describe('AuthLoginForm', () => {
  it('renders name field and submit', () => {
    renderWithStore(<AuthLoginForm />)

    expect(screen.getByPlaceholderText('Nom')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Se connecter' })).toBeInTheDocument()
  })
})
