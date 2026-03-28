import { resetCity, selectAllCities } from '#city/slice'
import { useAppDispatch, useAppSelector } from '#store/type'
import React, { useEffect } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { selectToken } from '#auth/slice'
import { getOutpost } from '#outpost/slice/thunk'
import { selectOutpostId, selectOutposts } from '#outpost/slice'
import { getCity } from '#city/slice/thunk'
import { toast } from 'react-toastify'
import { listTroups } from '#troup/slice/thunk'

export const OutpostRoot: React.FC = () => {
  const { outpostId } = useParams()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const cities = useAppSelector(selectAllCities)
  const token = useAppSelector(selectToken)
  const selectedOutpostId = useAppSelector(selectOutpostId)
  const outposts = useAppSelector(selectOutposts)

  useEffect(() => {
    if (!outpostId || !token) {
      return
    }

    dispatch(resetCity())
    dispatch(getOutpost(outpostId)).then(() => {
      dispatch(listTroups())
    })
  }, [outpostId, token])

  // unstable way to handle outpost deletion and redirection
  // TODO: improve with an init feature to be sure initial data is loaded before redirecting
  useEffect(() => {
    const outpostExists = outposts.some(outpost => outpost.id === outpostId)
    if (!outpostExists) {
      const cityId = cities[0]?.id
      if (!cityId) {
        return
      }

      toast.warn('L\'avant poste temporaire a été supprimé')
      dispatch(getCity(cityId))
      navigate(`/city/${cityId}`)
    }

  }, [outpostId, selectedOutpostId])

  return <>
    <Outlet />
  </>
}
