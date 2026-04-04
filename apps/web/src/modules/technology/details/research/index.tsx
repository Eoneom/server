import React from 'react'
import { useParams } from 'react-router-dom'

import { hasEnoughResources } from '#city/helper'
import { Technology, TechnologyItem } from '#types'
import { Button } from '#ui/button'
import { useRequirement } from '#requirement/hook'
import { useGetCity } from '#city/hooks'
import { useListTechnologies, useResearchTechnology } from '#technology/hooks'

interface Props {
  technology: Technology
}

export const TechnologyDetailsResearch: React.FC<Props> = ({ technology }) => {
  const { cityId } = useParams()
  const { data: city } = useGetCity(cityId)
  const { data: technologies = [] } = useListTechnologies()
  const research = useResearchTechnology(cityId)
  const { isRequirementMet } = useRequirement({ requirement: technology.requirement })

  const inProgress = technologies.find(
    (t): t is Extract<TechnologyItem, { research_at: number }> => 'research_at' in t
  )

  const canResearch = !inProgress &&
    hasEnoughResources({ city: city ?? null, cost: technology.research_cost }) &&
    isRequirementMet

  return <Button
    disabled={!canResearch}
    onClick={() => research.mutate(technology.code)}
  >
    Rechercher
  </Button>
}
