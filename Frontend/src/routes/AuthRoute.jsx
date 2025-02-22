import { Navigate, Route, Routes } from 'react-router-dom'
import Register from '../pages/Register.jsx'
import Login from '../pages/Login.jsx'
function AuthRoute() {
  return (
    <Routes>
        <Route path='/' element={<Navigate to="register" replace/>}/>
        <Route path='register' element={<Register/>}/>
        <Route path='login' element={<Login/>}/>
    </Routes>
  )
}

export default AuthRoute