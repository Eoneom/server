import { formatDate } from './transform'

describe('formatDate', () => {
  it('returns DD/MM/YYYY HH:mm with zero-padded parts', () => {
    const ts = new Date(2024, 2, 5, 4, 2, 0).getTime()
    expect(formatDate(ts)).toBe('05/03/2024 04:02')
  })

  it('formats start of year midnight', () => {
    const ts = new Date(2024, 0, 1, 0, 0, 0).getTime()
    expect(formatDate(ts)).toBe('01/01/2024 00:00')
  })

  it('formats end of day', () => {
    const ts = new Date(2023, 11, 31, 23, 59, 0).getTime()
    expect(formatDate(ts)).toBe('31/12/2023 23:59')
  })
})
