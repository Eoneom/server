import { useAppDispatch, useAppSelector } from '#store/type'
import { selectTroup, selectTroupInProgress } from '#troup/slice'
import { recruitTroup } from '#troup/slice/thunk'
import { Button } from '#ui/button'
import React from 'react'

interface Props {
  count: number
  onChange: (count: number) => void
  canRecruit: boolean
}

export const TroupDetailsRecruit: React.FC<Props> = ({ onChange, count, canRecruit }) => {
  const dispatch = useAppDispatch()
  const inProgress = useAppSelector(selectTroupInProgress)
  const troup = useAppSelector(selectTroup)

  if (inProgress || !troup) {
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
          dispatch(recruitTroup({ code: troup.code, count }))
          onChange(1)
        }}
      >
          Recruter
      </Button>
    </>
  )
}
