import React from 'react'

import { hasEnoughResources } from '#city/helper'
import { Technology } from '#types'
import { Button } from '#ui/button'
import { useRequirement } from '#requirement/hook'
import { useAppDispatch, useAppSelector } from '#store/type'
import { selectCity } from '#city/slice'
import { selectTechnologyInProgress } from '#technology/slice'
import { researchTechnology } from '#technology/slice/thunk'

interface Props {
  technology: Technology
}

export const TechnologyDetailsResearch: React.FC<Props> = ({ technology }) => {
  const dispatch = useAppDispatch()
  const inProgress = useAppSelector(selectTechnologyInProgress)
  const city = useAppSelector(selectCity)
  const { isRequirementMet } = useRequirement({ requirement: technology.requirement })

  const canResearch = !inProgress &&
    hasEnoughResources({ city, cost: technology.research_cost }) &&
    isRequirementMet

  return <Button
    disabled={!canResearch}
    onClick={() => dispatch(researchTechnology(technology.code))}
  >
    Rechercher
  </Button>
}
