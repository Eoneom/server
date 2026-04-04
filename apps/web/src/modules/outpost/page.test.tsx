import React from 'react'
import { render, screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OutpostType } from '@eoneom/api-client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { AuthProvider } from '#auth/context'
import { LocationProvider } from '#location/context'
import { outpostKeys } from '#outpost/hooks'
import type { Outpost } from '#types'

import { OutpostPage } from './page'

const mockSettleCity = jest.fn()
const mockSetPermanent = jest.fn()

jest.mock('#outpost/hooks', () => ({
  ...jest.requireActual('#outpost/hooks'),
  useSetOutpostPermanent: () => ({ mutate: mockSetPermanent }),
}))

jest.mock('#city/hooks', () => ({
  ...jest.requireActual('#city/hooks'),
  useSettleCity: () => ({ mutate: mockSettleCity }),
}))

jest.mock('#outpost/settle', () => ({
  OutpostSettle: ({ onSettle }: { onSettle: (name: string) => void }) => (
    <button onClick={() => onSettle('CityName')}>Settle</button>
  )
}))

let queryClient: QueryClient

function renderWithOutpost(outpost: Outpost | null) {
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  if (outpost) {
    queryClient.setQueryData(outpostKeys.detail(outpost.id), outpost)
  }

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LocationProvider>
          <OutpostPage outpostId="o1" />
        </LocationProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

describe('OutpostPage', () => {
  beforeEach(() => {
    mockSettleCity.mockReset()
    mockSetPermanent.mockReset()
  })

  it('shows make permanent button only for temporary outpost', async () => {
    const outpost: Outpost = {
      id: 'o1',
      coordinates: { sector: 1, x: 1, y: 1 },
      type: OutpostType.TEMPORARY,
      plastic: 0,
      mushroom: 0
    }

    renderWithOutpost(outpost)
    expect(screen.getByRole('button', { name: 'Rendre permanent' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Settle' })).toBeInTheDocument()

    act(() => {
      queryClient.setQueryData(outpostKeys.detail(outpost.id), { ...outpost, type: OutpostType.PERMANENT })
    })

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Rendre permanent' })).not.toBeInTheDocument()
    })
    expect(screen.queryByRole('button', { name: 'Settle' })).not.toBeInTheDocument()
  })

  it('dispatches setOutpostPermanent on button click', async () => {
    const outpost: Outpost = {
      id: 'o1',
      coordinates: { sector: 1, x: 1, y: 1 },
      type: OutpostType.TEMPORARY,
      plastic: 0,
      mushroom: 0
    }
    renderWithOutpost(outpost)

    await userEvent.click(screen.getByRole('button', { name: 'Rendre permanent' }))
    expect(mockSetPermanent).toHaveBeenCalledTimes(1)
  })
})
