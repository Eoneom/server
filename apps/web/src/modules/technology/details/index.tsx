import React from 'react'
import { Technology } from '#types'
import { TechnologyTranslations } from '#technology/translations'
import { Requirement } from '#requirement/index'
import { LayoutDetailsContent } from '#ui/layout/details/content'
import { Cost } from '#cost/index'
import { TechnologyDetailsResearch } from '#technology/details/research'

interface Props {
  technology: Technology
}

export const TechnologyDetails: React.FC<Props> = ({ technology }) => {
  const { name, description, effect } = TechnologyTranslations[technology.code]

  return <>
    <LayoutDetailsContent>
      <h2>{name}</h2>
      <p>{effect}</p>
      <TechnologyDetailsResearch technology={technology}/>
      <p className='description'>{description}</p>
    </LayoutDetailsContent>

    <article id="requirement">
      <Requirement requirements={technology.requirement} />
      <Cost {...technology.research_cost}/>
    </article>
  </>
}
