import React, { useMemo } from 'react'

import { OutpostItem } from '#types'
import { NavLocationItem } from '#ui/nav/location/item'
import { formatCoordinates } from '#helpers/transform'
import { OutpostType } from '@kroust/swarm-client'

interface Props {
  outposts: OutpostItem[]
}

export const NavLocationOutposts: React.FC<Props> = ({ outposts }) => {
  const temporaries = useMemo(() => {
    return outposts
      .filter(outpost => outpost.type === OutpostType.TEMPORARY)
      .sort((a, b) => formatCoordinates(a.coordinates).localeCompare(formatCoordinates(b.coordinates)))
  }, [outposts])

  const permanents = useMemo(() => {
    return outposts
      .filter(outpost => outpost.type !== OutpostType.TEMPORARY)
      .sort((a, b) => formatCoordinates(a.coordinates).localeCompare(formatCoordinates(b.coordinates)))
  }, [outposts])

  if (!outposts.length) {
    return null
  }

  return <>
    <h3>Avant-postes</h3>
    {
      Boolean(temporaries.length) && <>
        <h5>Temporaires</h5>
        <ul>
          {
            temporaries.map(outpost =>
              <NavLocationItem
                key={outpost.id}
                to={`/outpost/${outpost.id}`}
                text={formatCoordinates(outpost.coordinates)}
              />
            )
          }
        </ul>
      </>
    }

    {
      Boolean(permanents.length) && <>
        <h5>Permanents</h5>
        <ul>
          {
            permanents.map(outpost =>
              <NavLocationItem
                key={outpost.id}
                to={`/outpost/${outpost.id}`}
                text={formatCoordinates(outpost.coordinates)}
              />
            )
          }
        </ul>
      </>
    }
  </>
}
