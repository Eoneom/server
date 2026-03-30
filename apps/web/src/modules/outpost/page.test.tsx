import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OutpostType } from '@eoneom/api-client'

import { OutpostPage } from './page'

const mockDispatch = jest.fn()
const mockSettleCity = jest.fn((name: string) => ({ type: 'city/settle', payload: name }))
const mockSetOutpostPermanent = jest.fn(() => ({ type: 'outpost/set-permanent' }))

jest.mock('#store/type', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: () => mockedOutpost
}))

jest.mock('#city/slice/thunk', () => ({
  settleCity: (name: string) => mockSettleCity(name)
}))

jest.mock('#outpost/slice/thunk', () => ({
  setOutpostPermanent: () => mockSetOutpostPermanent()
}))

jest.mock('#outpost/settle', () => ({
  OutpostSettle: ({ onSettle }: { onSettle: (name: string) => void }) => (
    <button onClick={() => onSettle('CityName')}>Settle</button>
  )
}))

let mockedOutpost: {
  id: string
  coordinates: { sector: number; x: number; y: number }
  type: OutpostType
  plastic: number
  mushroom: number
} | null = null

describe('OutpostPage', () => {
  beforeEach(() => {
    mockedOutpost = null
    mockDispatch.mockReset()
    mockSettleCity.mockClear()
    mockSetOutpostPermanent.mockClear()
  })

  it('shows make permanent button only for temporary outpost', () => {
    mockedOutpost = {
      id: 'o1',
      coordinates: { sector: 1, x: 1, y: 1 },
      type: OutpostType.TEMPORARY,
      plastic: 0,
      mushroom: 0
    }

    const { rerender } = render(<OutpostPage />)
    expect(screen.getByRole('button', { name: 'Rendre permanent' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Settle' })).toBeInTheDocument()

    mockedOutpost = {
      ...mockedOutpost,
      type: OutpostType.PERMANENT
    }
    rerender(<OutpostPage />)

    expect(screen.queryByRole('button', { name: 'Rendre permanent' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Settle' })).not.toBeInTheDocument()
  })

  it('dispatches setOutpostPermanent on button click', async () => {
    mockedOutpost = {
      id: 'o1',
      coordinates: { sector: 1, x: 1, y: 1 },
      type: OutpostType.TEMPORARY,
      plastic: 0,
      mushroom: 0
    }
    render(<OutpostPage />)

    await userEvent.click(screen.getByRole('button', { name: 'Rendre permanent' }))

    expect(mockSetOutpostPermanent).toHaveBeenCalledTimes(1)
    expect(mockDispatch).toHaveBeenCalledTimes(1)
  })
})
