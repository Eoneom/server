import React from 'react'

import { useRecruitTroop, useListCityTroops } from '#troop/hooks'
import { Button } from '#ui/button'
import { Troop, TroopItem } from '#types'

type TroopWithRecruitment = TroopItem & { ongoing_recruitment: NonNullable<TroopItem['ongoing_recruitment']> }

interface Props {
  cityId: string | null
  troop: Troop
  count: number
  onChange: (count: number) => void
  canRecruit: boolean
}

export const TroopDetailsRecruit: React.FC<Props> = ({ cityId, troop, onChange, count, canRecruit }) => {
  const { data: troops = [] } = useListCityTroops(cityId)
  const recruit = useRecruitTroop(cityId)

  const inProgress = troops.find(
    (t): t is TroopWithRecruitment => Boolean(t.ongoing_recruitment)
  )

  if (inProgress) {
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
          recruit.mutate({ code: troop.code, count })
          onChange(1)
        }}
      >
        Recruter
      </Button>
    </>
  )
}
