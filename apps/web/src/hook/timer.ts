import { useEffect, useState } from 'react'
import { getRemainingSeconds } from '#helpers/transform'

interface HookTimerProps {
  doneAt?: number
  onDone: () => void
  onTick?: () => void
  tickDuration?: number
}

interface HookTimer {
  remainingTime: number
  reset: () => void
}

export const useTimer = ({ doneAt, onDone, onTick, tickDuration }: HookTimerProps): HookTimer => {
  const [remainingTime, setRemainingTime] = useState(0)
  const [lastTick, setLastTick] = useState(0)
  const reset = () => {
    setRemainingTime(0)
    setLastTick(0)
  }

  useEffect(() => {
    if (!doneAt) {
      return
    }

    const remainingSeconds = getRemainingSeconds(doneAt)

    setRemainingTime(remainingSeconds)
    setLastTick(remainingSeconds)

    const interval = setInterval(() => {
      const seconds = getRemainingSeconds(doneAt)
      if (seconds <= 0) {
        reset()
        clearInterval(interval)
        onDone()
        return
      }

      const isTickElapsed = Math.abs(lastTick - seconds) > (tickDuration ?? 1)
      if (onTick && isTickElapsed) {
        setLastTick(seconds)
        onTick()
      }

      setRemainingTime(seconds)
    }, 1000)

    return () => clearInterval(interval)
  }, [doneAt, lastTick])

  return {
    remainingTime,
    reset
  }
}
