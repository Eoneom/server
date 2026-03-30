import React from 'react'

import { formatCoordinates } from '#helpers/transform'
import { useAppDispatch, useAppSelector } from '#store/type'
import { selectOutpost } from '#outpost/slice'
import { settleCity } from '#city/slice/thunk'
import { OutpostSettle } from '#outpost/settle'
import { setOutpostPermanent } from '#outpost/slice/thunk'
import { Button } from '#ui/button'
import { OutpostType } from '@eoneom/api-client'

export const OutpostPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const outpost = useAppSelector(selectOutpost)

  const onSettle = (cityName: string) => {
    dispatch(settleCity(cityName))
  }

  const onSetPermanent = () => {
    dispatch(setOutpostPermanent())
  }

  return outpost && <section id="content">
    {outpost.id} {formatCoordinates(outpost.coordinates)}
    {outpost.type === OutpostType.TEMPORARY && (<>
      <Button onClick={onSetPermanent}>
        Rendre permanent
      </Button>
      <OutpostSettle onSettle={name => onSettle(name)}/>
    </>)}
  </section>
}
