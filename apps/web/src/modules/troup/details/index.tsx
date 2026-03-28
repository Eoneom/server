import React, { useState } from 'react'

import { TroupTranslations } from '#troup/translations'
import { TroupDetailsRecruit } from '#troup/details/recruit'
import { Requirement } from '#requirement/index'
import { LayoutDetailsContent } from '#ui/layout/details/content'
import { Cost } from '#cost/index'
import { hasEnoughResources } from '#city/helper'
import { useRequirement } from '#requirement/hook'
import { useAppSelector } from '#store/type'
import { selectCity } from '#city/slice'
import { selectTroup, selectTroupInProgress } from '#troup/slice'

export const TroupDetails: React.FC = () => {
  const city = useAppSelector(selectCity)
  const troup = useAppSelector(selectTroup)
  const inProgress = useAppSelector(selectTroupInProgress)
  const [count, setCount] = useState(1)

  if (!troup) {
    return null
  }

  const { name, description, effect } = TroupTranslations[troup.code]
  const numberCount = Number.isNaN(count) ? 1 : count
  const plasticCost = numberCount*troup.cost.plastic
  const mushroomCost = numberCount*troup.cost.mushroom

  const { isRequirementMet } = useRequirement({ requirement: troup.requirement })

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

      <TroupDetailsRecruit
        canRecruit={canRecruit}
        count={count}
        onChange={value => setCount(value)}
      />
      <p className='description'>{description}</p>
    </LayoutDetailsContent>

    <aside id="requirement">
      <Requirement requirements={troup.requirement} />
      <Cost
        plastic={plasticCost}
        mushroom={mushroomCost}
        duration={numberCount*troup.cost.duration}
      />
    </aside>
  </>
}
