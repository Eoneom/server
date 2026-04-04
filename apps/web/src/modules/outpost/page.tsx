import React from 'react'
import { useParams } from 'react-router-dom'

import { formatCoordinates } from '#helpers/transform'
import { useGetOutpost, useSetOutpostPermanent } from '#outpost/hooks'
import { useSettleCity } from '#city/hooks'
import { OutpostSettle } from '#outpost/settle'
import { Button } from '#ui/button'
import { OutpostType } from '@eoneom/api-client'

export const OutpostPage: React.FC = () => {
  const { outpostId } = useParams()
  const { data: outpost } = useGetOutpost(outpostId)
  const setPermanent = useSetOutpostPermanent(outpostId)
  const settleCity = useSettleCity()

  return outpost ? <section id="content">
    {outpost.id} {formatCoordinates(outpost.coordinates)}
    {outpost.type === OutpostType.TEMPORARY && (<>
      <Button onClick={() => setPermanent.mutate()}>
        Rendre permanent
      </Button>
      <OutpostSettle onSettle={name => settleCity.mutate(name)} />
    </>)}
  </section> : null
}
