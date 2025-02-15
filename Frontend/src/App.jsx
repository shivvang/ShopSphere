import { Route, Routes } from 'react-router-dom'
import AuthRoute from './routes/AuthRoute.jsx'
import Home from './pages/Home.jsx'

function App() {
  return (
   <Routes>
     <Route path='/auth/*' element={<AuthRoute/>} />
     <Route path='/home' element={<Home/>}/>
   </Routes>
  )
}

export default App