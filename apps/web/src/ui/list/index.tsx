import React from 'react'

interface Props {
  inProgress?: React.ReactNode
  items: React.ReactNode
}

export const List: React.FC<Props> = ({ inProgress, items }) => {
  return <>
    {inProgress}
    <div className='list'>
      {items}
    </div>
  </>
}
