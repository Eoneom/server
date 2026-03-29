import assert from 'assert'
import { resolveGameTimeSpeed } from '#shared/game-time-scale'

describe('resolveGameTimeSpeed', () => {
  it('defaults to 1 when unset or empty', () => {
    assert.strictEqual(resolveGameTimeSpeed(undefined), 1)
    assert.strictEqual(resolveGameTimeSpeed(''), 1)
    assert.strictEqual(resolveGameTimeSpeed('   '), 1)
  })

  it('parses positive numbers', () => {
    assert.strictEqual(resolveGameTimeSpeed('2'), 2)
    assert.strictEqual(resolveGameTimeSpeed('0.5'), 0.5)
  })

  it('returns 1 for invalid or non-positive values', () => {
    assert.strictEqual(resolveGameTimeSpeed('0'), 1)
    assert.strictEqual(resolveGameTimeSpeed('-1'), 1)
    assert.strictEqual(resolveGameTimeSpeed('nan'), 1)
    assert.strictEqual(resolveGameTimeSpeed('foo'), 1)
  })
})
