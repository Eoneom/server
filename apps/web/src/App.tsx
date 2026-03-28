import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import { AuthLoginForm } from '#auth/login-form'
import { Header } from '#ui/header'
import { NavMenu } from '#ui/nav/menu'
import { NavLocation } from '#ui/nav/location'
import { useAppDispatch, useAppSelector } from './store/type'
import { listCities } from '#city/slice/thunk'
import { retrieveStoredToken } from '#auth/slice/thunk'
import { selectToken } from '#auth/slice'
import { countUnreadReports } from '#communication/report/slice/thunk'
import { listOutposts } from '#outpost/slice/thunk'
import { selectAllCities } from '#city/slice'

const App: React.FC = () => {
  const dispatch = useAppDispatch()
  const token = useAppSelector(selectToken)
  const cities = useAppSelector(selectAllCities)

  useEffect(() => {
    dispatch(retrieveStoredToken())
  }, [])

  useEffect(() => {
    if (!token) {
      return
    }

    dispatch(listOutposts())
    dispatch(listCities())
    dispatch(countUnreadReports())
  }, [token])

  if (!token) {
    return <AuthLoginForm />
  }

  if (!cities.length) {
    return <>Loading</>
  }

  return <>
    <Header />
    <div id="main">
      <NavMenu />
      <main>
        <Outlet />
      </main>

      <NavLocation />
    </div>

    <ToastContainer
      position='bottom-right'
      autoClose={3000}
    />
  </>
}

export default App
