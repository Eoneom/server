import React from 'react'
import { TechnologyCode } from '@eoneom/api-client'

import { TechnologyItem } from '#types'
import { technologyImageSrc } from '#technology/image'
import { TechnologyTranslations } from '#technology/translations'
import { ListItemLevel } from '#ui/list/item/level'

interface Props {
  active: boolean
  technologyItem: TechnologyItem
  onSelect: (code: TechnologyCode) => void
}

export const TechnologyListItem: React.FC<Props> = ({ active, technologyItem, onSelect }) => {
  const { name } = TechnologyTranslations[technologyItem.code]

  return <ListItemLevel
    active={active}
    name={name}
    level={technologyItem.level}
    image={{
      src: technologyImageSrc(technologyItem.code),
      alt: '',
    }}
    onSelect={() => onSelect(technologyItem.code)}
  />
}
