import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AuthRoute from './routes/AuthRoute.jsx'

function App() {
  return (
   <Routes>
     <Route path='/auth/*' element={<AuthRoute/>} />
   </Routes>
  )
}

export default App