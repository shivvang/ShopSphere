import { Navigate, Route, Routes } from 'react-router-dom'
import SellerRegister from '../pages/SellerRegister.jsx'
import SellerLogin from '../pages/SellerLogin.jsx'
import SellerDashboard from '../pages/SellerDashboard.jsx'
function SellerRoute() {
  return (
    <Routes>
        <Route path='/' element={<Navigate to="register" replace/>}/>
        <Route path='register' element={<SellerRegister/>}/>
        <Route path='login' element={<SellerLogin/>}/>
        <Route path='dashboard' element={<SellerDashboard />}/>
    </Routes>
  )
}

export default SellerRoute