import { lazy} from 'react';
import { Navigate, Route, Routes } from 'react-router-dom'

const  Register = lazy(()=>import('../pages/Register.jsx'));
const Login =  lazy(()=>import('../pages/Login.jsx'));

function AuthRoute() {
  return (
    <Routes>
        <Route path='/' element={<Navigate to="login" replace/>}/>
        <Route path='register' element={<Register/>}/>
        <Route path='login' element={<Login/>}/>
    </Routes>
  )
}

export default AuthRoute