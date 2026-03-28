import React from 'react'

import { formatCoordinates } from '#helpers/transform'
import { useAppDispatch, useAppSelector } from '#store/type'
import { selectOutpost } from '#outpost/slice'
import { settleCity } from '#city/slice/thunk'
import { OutpostSettle } from '#outpost/settle'

export const OutpostPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const outpost = useAppSelector(selectOutpost)

  const onSettle = (cityName: string) => {
    dispatch(settleCity(cityName))
  }

  return outpost && <section id="content">
    {outpost.id} {formatCoordinates(outpost.coordinates)}
    <OutpostSettle onSettle={name => onSettle(name)}/>
  </section>
}
