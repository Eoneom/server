import React, { useMemo } from 'react'

import { TechnologyListItem } from '#technology/list/item'
import { TechnologyTranslations } from '#technology/translations'
import { Button } from '#ui/button'
import { CountdownProgress } from '#ui/countdown-progress'
import { List } from '#ui/list'
import { useCountdownProgress } from '#hook/countdown-progress'
import { useAppDispatch, useAppSelector } from '#store/type'
import { selectTechnologyInProgress, selectTechnologies, selectTechnology } from '#technology/slice'
import { cancelTechnology, finishResearch } from '#technology/slice/thunk'

export const TechnologyList: React.FC = () => {
  const dispatch = useAppDispatch()

  const technology = useAppSelector(selectTechnology)
  const technologies = useAppSelector(selectTechnologies)
  const inProgress = useAppSelector(selectTechnologyInProgress)

  const { remainingSeconds, elapsedProgress } = useCountdownProgress({
    onDone: () => dispatch(finishResearch()),
    endAt: inProgress?.research_at,
    startAt: inProgress?.research_started_at
  })

  const inProgressComponent = inProgress && <>
    <CountdownProgress
      summary={<>En cours: {TechnologyTranslations[inProgress.code].name}</>}
      elapsedProgress={elapsedProgress}
      remainingSeconds={remainingSeconds}
    />
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
