import React from 'react'
import { formatTime } from '#helpers/transform'
import { TroupTranslations } from '#troup/translations'
import { Button } from '#ui/button'
import { useTimer } from '#hook/timer'
import { useAppDispatch, useAppSelector } from '#store/type'
import { selectTroupInProgress } from '#troup/slice'
import { cancelTroup, progressRecruitTroup } from '#troup/slice/thunk'

export const TroupListInProgress: React.FC = () => {
  const dispatch = useAppDispatch()
  const inProgress = useAppSelector(selectTroupInProgress)

  const { remainingTime, reset } = useTimer({
    doneAt: inProgress?.ongoing_recruitment?.finish_at,
    onDone: () => dispatch(progressRecruitTroup()),
    onTick:  () => dispatch(progressRecruitTroup()),
    tickDuration: inProgress?.ongoing_recruitment?.duration_per_unit
  })

  if (!inProgress) {
    return null
  }

  const handleCancel = () => {
    dispatch(cancelTroup())
    reset()
  }

  return <>
    <p>
      En cours: {inProgress.ongoing_recruitment?.remaining_count} {TroupTranslations[inProgress.code].name}
      <strong>{formatTime(remainingTime)}</strong>
    </p>
    <Button onClick={handleCancel}>Annuler</Button>
  </>
}
