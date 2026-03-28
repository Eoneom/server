import { useAppDispatch, useAppSelector } from '#store/type'
import { selectTroop, selectTroopInProgress } from '#troop/slice'
import { recruitTroop } from '#troop/slice/thunk'
import { Button } from '#ui/button'
import React from 'react'

interface Props {
  count: number
  onChange: (count: number) => void
  canRecruit: boolean
}

export const TroopDetailsRecruit: React.FC<Props> = ({ onChange, count, canRecruit }) => {
  const dispatch = useAppDispatch()
  const inProgress = useAppSelector(selectTroopInProgress)
  const troop = useAppSelector(selectTroop)

  if (inProgress || !troop) {
    return null
  }

  return (
    <>
      <input
        type="number"
        onChange={event => {
          const value = Number.parseInt(event.target.value)
          if (Number.isNaN(value) || value <= 0) {
            onChange(1)
            return
          }
          onChange(value)
        }}
        min={1}
      />

      <Button
        disabled={!canRecruit}
        onClick={() => {
          dispatch(recruitTroop({ code: troop.code, count }))
          onChange(1)
        }}
      >
          Recruter
      </Button>
    </>
  )
}
