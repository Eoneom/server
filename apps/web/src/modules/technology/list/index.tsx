import React, { useMemo } from 'react'

import { TechnologyListItem } from '#technology/list/item'
import { TechnologyTranslations } from '#technology/translations'
import { formatTime } from '#helpers/transform'
import { Button } from '#ui/button'
import { List } from '#ui/list'
import { useTimer } from '#hook/timer'
import { useAppDispatch, useAppSelector } from '#store/type'
import { selectTechnologyInProgress, selectTechnologies, selectTechnology } from '#technology/slice'
import { cancelTechnology, finishResearch } from '#technology/slice/thunk'

export const TechnologyList: React.FC = () => {
  const dispatch = useAppDispatch()

  const technology = useAppSelector(selectTechnology)
  const technologies = useAppSelector(selectTechnologies)
  const inProgress = useAppSelector(selectTechnologyInProgress)

  const { remainingTime } = useTimer({
    onDone: () => dispatch(finishResearch()),
    doneAt: inProgress?.research_at
  })

  const inProgressComponent = inProgress && <>
    <p>En cours: {TechnologyTranslations[inProgress.code].name} <strong>{formatTime(remainingTime)}</strong></p>
    <Button onClick={() => dispatch(cancelTechnology())}>Annuler</Button>
  </>

  const items = useMemo(() => {
    return technologies.map(technologyItem => <TechnologyListItem
      active={technologyItem.code === technology?.code}
      key={technologyItem.id}
      technologyItem={technologyItem}
    />)
  }, [technology, technologies])

  return <List
    inProgress={inProgressComponent}
    items={items}
  />
}
