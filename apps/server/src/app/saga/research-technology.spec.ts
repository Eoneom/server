import assert from 'assert'
import { sagaResearchTechnology } from './research-technology'
import { finishBuildingUpgrade } from '#app/command/building/finish-upgrade'
import { researchTechnology } from '#app/command/technology/research'
import { TechnologyCode } from '#core/technology/constant/code'

jest.mock('#app/command/building/finish-upgrade')
jest.mock('#app/command/technology/research')

describe('sagaResearchTechnology', () => {
  const player_id = 'player_id'
  const city_id = 'city_id'
  const technology_code = TechnologyCode.ARCHITECTURE

  beforeEach(() => {
    jest.clearAllMocks()
    ;(finishBuildingUpgrade as jest.Mock).mockResolvedValue(null)
    ;(researchTechnology as jest.Mock).mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('calls finishBuildingUpgrade with player_id and city_id', async () => {
    await sagaResearchTechnology({ player_id, city_id, technology_code })

    assert.strictEqual((finishBuildingUpgrade as jest.Mock).mock.calls.length, 1)
    assert.deepStrictEqual((finishBuildingUpgrade as jest.Mock).mock.calls[0][0], { player_id, city_id })
  })

  it('calls researchTechnology with correct args', async () => {
    await sagaResearchTechnology({ player_id, city_id, technology_code })

    assert.strictEqual((researchTechnology as jest.Mock).mock.calls.length, 1)
    assert.deepStrictEqual((researchTechnology as jest.Mock).mock.calls[0][0], { player_id, city_id, technology_code })
  })

  it('calls finishBuildingUpgrade before researchTechnology', async () => {
    const order: string[] = []
    ;(finishBuildingUpgrade as jest.Mock).mockImplementation(async () => { order.push('finish'); return null })
    ;(researchTechnology as jest.Mock).mockImplementation(async () => { order.push('research') })

    await sagaResearchTechnology({ player_id, city_id, technology_code })

    assert.deepStrictEqual(order, ['finish', 'research'])
  })

  it('propagates errors from finishBuildingUpgrade', async () => {
    ;(finishBuildingUpgrade as jest.Mock).mockRejectedValue(new Error('finish error'))

    await assert.rejects(() => sagaResearchTechnology({ player_id, city_id, technology_code }), /finish error/)
    assert.strictEqual((researchTechnology as jest.Mock).mock.calls.length, 0)
  })

  it('propagates errors from researchTechnology', async () => {
    ;(researchTechnology as jest.Mock).mockRejectedValue(new Error('research error'))

    await assert.rejects(() => sagaResearchTechnology({ player_id, city_id, technology_code }), /research error/)
  })
})
