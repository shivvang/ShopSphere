import { Route, Routes } from 'react-router-dom'
import AuthRoute from './routes/AuthRoute.jsx'
import Home from './pages/Home.jsx'
import Search from './pages/Search.jsx'

function App() {
  return (
   <Routes>
     <Route path='/auth/*' element={<AuthRoute/>} />
     <Route path='/home' element={<Home/>}/>
     <Route path='/search' element={<Search/>}/>
   </Routes>
  )
}

export default App