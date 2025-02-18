import { Route, Routes } from 'react-router-dom'
import AuthRoute from './routes/AuthRoute.jsx'
import Home from './pages/Home.jsx'
import Search from './pages/Search.jsx'
import ProfileRoute from './routes/ProfileRoute.jsx'


function App() {
  return (
   <Routes>
     <Route path='/auth/*' element={<AuthRoute/>} />
     <Route path='/home' element={<Home/>}/>
     <Route path='/search' element={<Search/>}/>
     <Route path="/profile/*" element={<ProfileRoute />} />
   </Routes>
  )
}

export default App