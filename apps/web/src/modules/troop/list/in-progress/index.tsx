import React from 'react'
import { formatTime } from '#helpers/transform'
import { TroopTranslations } from '#troop/translations'
import { Button } from '#ui/button'
import { useTimer } from '#hook/timer'
import { useAppDispatch, useAppSelector } from '#store/type'
import { selectTroopInProgress } from '#troop/slice'
import { cancelTroop, progressRecruitTroop } from '#troop/slice/thunk'

export const TroopListInProgress: React.FC = () => {
  const dispatch = useAppDispatch()
  const inProgress = useAppSelector(selectTroopInProgress)

  const { remainingTime, reset } = useTimer({
    doneAt: inProgress?.ongoing_recruitment?.finish_at,
    onDone: () => dispatch(progressRecruitTroop()),
    onTick:  () => dispatch(progressRecruitTroop()),
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
    <p>
      En cours: {inProgress.ongoing_recruitment?.remaining_count} {TroopTranslations[inProgress.code].name}
      <strong>{formatTime(remainingTime)}</strong>
    </p>
    <Button onClick={handleCancel}>Annuler</Button>
  </>
}
