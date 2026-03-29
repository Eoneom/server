import React from 'react'

import { formatDurationMmSs } from '#helpers/transform'

export interface CountdownProgressProps {
  summary: React.ReactNode
  elapsedProgress: number
  remainingSeconds: number
  doneLabel?: string
}

export const CountdownProgress: React.FC<CountdownProgressProps> = ({
  summary,
  elapsedProgress,
  remainingSeconds,
  doneLabel = 'Terminé'
}) => {
  const timeLabel = formatDurationMmSs(remainingSeconds)
  const complete = remainingSeconds <= 0
  const fillPct = Math.min(100, Math.max(0, elapsedProgress * 100))

  return (
    <div className="countdown-progress">
      <p className="countdown-progress__summary">{summary}</p>
      {complete ? (
        <p className="countdown-progress__time" aria-live="polite">
          {doneLabel}
        </p>
      ) : (
        <>
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(elapsedProgress * 100)}
            aria-valuetext={`${Math.round(elapsedProgress * 100)} pour cent écoulé, ${timeLabel} restant`}
          >
            <div className="countdown-progress__track">
              <div
                className="countdown-progress__fill"
                style={
                  {
                    '--countdown-progress-fill': `${fillPct}%`
                  } as React.CSSProperties
                }
              />
            </div>
          </div>
          <p className="countdown-progress__time" aria-live="polite">
            {timeLabel}
          </p>
        </>
      )}
    </div>
  )
}
