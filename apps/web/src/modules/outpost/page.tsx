import React from 'react'

import { formatCoordinates } from '#helpers/transform'
import { useGetOutpost, useSetOutpostPermanent } from '#outpost/hooks'
import { useSettleCity } from '#city/hooks'
import { OutpostSettle } from '#outpost/settle'
import { Button } from '#ui/button'
import { OutpostType } from '@eoneom/api-client'

interface Props {
  outpostId: string
}

export const OutpostPage: React.FC<Props> = ({ outpostId }) => {
  const { data: outpost } = useGetOutpost(outpostId)
  const setPermanent = useSetOutpostPermanent(outpostId)
  const settleCity = useSettleCity()

  return outpost ? <section id="content">
    {outpost.id} {formatCoordinates(outpost.coordinates)}
    {outpost.type === OutpostType.TEMPORARY && (<>
      <Button onClick={() => setPermanent.mutate()}>
        Rendre permanent
      </Button>
      <OutpostSettle outpostId={outpostId} onSettle={name => settleCity.mutate(name)} />
    </>)}
  </section> : null
}
