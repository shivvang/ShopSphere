import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Register from '../pages/Register.jsx'
function AuthRoute() {
  return (
    <Routes>
        <Route path='register' element={<Register/>}/>
    </Routes>
  )
}

export default AuthRoute