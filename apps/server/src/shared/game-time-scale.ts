/** Speed multiplier from `GAME_TIME_SCALE`: 2 = twice as fast (half wait times). */
export function resolveGameTimeSpeed(raw: string | undefined): number {
  if (raw == null || raw.trim() === '') {
    return 1
  }
  const n = Number.parseFloat(raw)
  if (!Number.isFinite(n) || n <= 0) {
    return 1
  }
  return n
}

export const gameTimeScale = resolveGameTimeSpeed(process.env.GAME_TIME_SCALE)

export function scaleGameDurationSeconds(seconds: number): number {
  return Math.max(1, Math.ceil(seconds / gameTimeScale))
}

export function scaleGameDurationMs(ms: number): number {
  return Math.max(1, Math.ceil(ms / gameTimeScale))
}
