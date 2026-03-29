import React from 'react'
import { TroopTranslations } from '#troop/translations'
import { Button } from '#ui/button'
import { CountdownProgress } from '#ui/countdown-progress'
import { useCountdownProgress } from '#hook/countdown-progress'
import { useAppDispatch, useAppSelector } from '#store/type'
import { selectTroopInProgress } from '#troop/slice'
import { cancelTroop, progressRecruitTroop } from '#troop/slice/thunk'

export const TroopListInProgress: React.FC = () => {
  const dispatch = useAppDispatch()
  const inProgress = useAppSelector(selectTroopInProgress)

  const { remainingSeconds, elapsedProgress, reset } = useCountdownProgress({
    endAt: inProgress?.ongoing_recruitment?.finish_at,
    startAt: inProgress?.ongoing_recruitment?.started_at,
    onDone: () => dispatch(progressRecruitTroop()),
    onTick: () => dispatch(progressRecruitTroop()),
    tickDuration: inProgress?.ongoing_recruitment?.duration_per_unit
  })

  if (!inProgress) {
    return null
  }

  const handleCancel = () => {
    dispatch(cancelTroop())
    reset()
  }

  return <>
    <CountdownProgress
      summary={
        <>
          En cours: {inProgress.ongoing_recruitment?.remaining_count}{' '}
          {TroopTranslations[inProgress.code].name}
        </>
      }
      elapsedProgress={elapsedProgress}
      remainingSeconds={remainingSeconds}
    />
    <Button onClick={handleCancel}>Annuler</Button>
  </>
}
