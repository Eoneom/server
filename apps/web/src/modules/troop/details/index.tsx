import React, { useState } from 'react'

import { TroopTranslations } from '#troop/translations'
import { TroopDetailsRecruit } from '#troop/details/recruit'
import { Requirement } from '#requirement/index'
import { LayoutDetailsContent } from '#ui/layout/details/content'
import { Cost } from '#cost/index'
import { hasEnoughResources } from '#city/helper'
import { useRequirement } from '#requirement/hook'
import { useAppSelector } from '#store/type'
import { selectCity } from '#city/slice'
import { selectTroop, selectTroopInProgress } from '#troop/slice'

export const TroopDetails: React.FC = () => {
  const city = useAppSelector(selectCity)
  const troop = useAppSelector(selectTroop)
  const inProgress = useAppSelector(selectTroopInProgress)
  const [count, setCount] = useState(1)

  if (!troop) {
    return null
  }

  const { name, description, effect } = TroopTranslations[troop.code]
  const numberCount = Number.isNaN(count) ? 1 : count
  const plasticCost = numberCount*troop.cost.plastic
  const mushroomCost = numberCount*troop.cost.mushroom

  const { isRequirementMet } = useRequirement({ requirement: troop.requirement })

  const canRecruit = !inProgress &&
    hasEnoughResources({
      city,
      cost: {
        plastic: plasticCost,
        mushroom: mushroomCost
      }
    }) &&
    isRequirementMet

  return <>
    <LayoutDetailsContent>
      <h2>{name}</h2>
      <p>{effect}</p>

      <TroopDetailsRecruit
        canRecruit={canRecruit}
        count={count}
        onChange={value => setCount(value)}
      />
      <p className='description'>{description}</p>
    </LayoutDetailsContent>

    <aside id="requirement">
      <Requirement requirements={troop.requirement} />
      <Cost
        plastic={plasticCost}
        mushroom={mushroomCost}
        duration={numberCount*troop.cost.duration}
      />
    </aside>
  </>
}
