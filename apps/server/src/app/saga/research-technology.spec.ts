import { vi, type MockInstance } from 'vitest'
import assert from 'assert'
import { sagaResearchTechnology } from './research-technology'
import { finishBuildingUpgrade } from '#app/command/building/finish-upgrade'
import { researchTechnology } from '#app/command/technology/research'
import { TechnologyCode } from '#core/technology/constant/code'

vi.mock('#app/command/building/finish-upgrade')
vi.mock('#app/command/technology/research')

describe('sagaResearchTechnology', () => {
  const player_id = 'player_id'
  const city_id = 'city_id'
  const technology_code = TechnologyCode.ARCHITECTURE

  beforeEach(() => {
    vi.clearAllMocks()
    ;(finishBuildingUpgrade as MockInstance).mockResolvedValue(null)
    ;(researchTechnology as MockInstance).mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls finishBuildingUpgrade with player_id and city_id', async () => {
    await sagaResearchTechnology({ player_id, city_id, technology_code })

    assert.strictEqual((finishBuildingUpgrade as MockInstance).mock.calls.length, 1)
    assert.deepStrictEqual((finishBuildingUpgrade as MockInstance).mock.calls[0][0], { player_id, city_id })
  })

  it('calls researchTechnology with correct args', async () => {
    await sagaResearchTechnology({ player_id, city_id, technology_code })

    assert.strictEqual((researchTechnology as MockInstance).mock.calls.length, 1)
    assert.deepStrictEqual((researchTechnology as MockInstance).mock.calls[0][0], { player_id, city_id, technology_code })
  })

  it('calls finishBuildingUpgrade before researchTechnology', async () => {
    const order: string[] = []
    ;(finishBuildingUpgrade as MockInstance).mockImplementation(async () => { order.push('finish'); return null })
    ;(researchTechnology as MockInstance).mockImplementation(async () => { order.push('research') })

    await sagaResearchTechnology({ player_id, city_id, technology_code })

    assert.deepStrictEqual(order, ['finish', 'research'])
  })

  it('propagates errors from finishBuildingUpgrade', async () => {
    ;(finishBuildingUpgrade as MockInstance).mockRejectedValue(new Error('finish error'))

    await assert.rejects(() => sagaResearchTechnology({ player_id, city_id, technology_code }), /finish error/)
    assert.strictEqual((researchTechnology as MockInstance).mock.calls.length, 0)
  })

  it('propagates errors from researchTechnology', async () => {
    ;(researchTechnology as MockInstance).mockRejectedValue(new Error('research error'))

    await assert.rejects(() => sagaResearchTechnology({ player_id, city_id, technology_code }), /research error/)
  })
})
