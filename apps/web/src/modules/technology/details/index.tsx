import React from 'react'
import { Technology } from '#types'
import { TechnologyTranslations } from '#technology/translations'
import { Requirement } from '#requirement/index'
import { LayoutDetailsContent } from '#ui/layout/details/content'
import { Cost } from '#cost/index'
import { TechnologyDetailsResearch } from '#technology/details/research'

interface Props {
  cityId: string
  technology: Technology
}

export const TechnologyDetails: React.FC<Props> = ({ cityId, technology }) => {
  const { name, description, effect } = TechnologyTranslations[technology.code]

  return <>
    <LayoutDetailsContent>
      <h2>{name}</h2>
      <p>{effect}</p>
      <TechnologyDetailsResearch cityId={cityId} technology={technology}/>
      <p className='description'>{description}</p>
    </LayoutDetailsContent>

    <article id="requirement">
      <Requirement cityId={cityId} requirements={technology.requirement} />
      <Cost cityId={cityId} {...technology.research_cost}/>
    </article>
  </>
}
