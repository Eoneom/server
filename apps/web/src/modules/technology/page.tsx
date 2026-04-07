import React, { useState } from 'react'
import { TechnologyCode } from '@eoneom/api-client'

import { TechnologyList } from '#technology/list'
import { TechnologyDetails } from '#technology/details/index'
import { LayoutPage } from '#ui/layout/page'
import { useGetTechnology } from '#technology/hooks'
import { Technology } from '#types'

interface Props {
  cityId: string
}

export const TechnologyPage: React.FC<Props> = ({ cityId }) => {
  const [selectedCode, setSelectedCode] = useState<TechnologyCode | null>(null)
  const { data: technology } = useGetTechnology(cityId, selectedCode)

  return <LayoutPage details={technology && <TechnologyDetails cityId={cityId} technology={technology as Technology}/>}>
    <TechnologyList
      selectedCode={selectedCode}
      onSelect={setSelectedCode}
    />
  </LayoutPage>
}
