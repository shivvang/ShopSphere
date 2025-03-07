import { Navigate, Route, Routes } from 'react-router-dom'
import SellerRegister from '../pages/SellerRegister.jsx'
import SellerLogin from '../pages/SellerLogin.jsx'
import SellerDashboard from '../pages/SellerDashboard.jsx'
import SellerSettings from '../pages/SellerSettings.jsx'
import {Provider} from "react-redux"
import { sellerStore } from '../redux/Seller/store.js'
import PrivateRoute from '../modules/Seller/PrivateRoute.jsx'

function SellerRoute() {
  return (
    <Provider store={sellerStore}>
    <Routes>
        <Route path='/' element={<Navigate to="register" replace/>}/>
        <Route path='register' element={<SellerRegister/>}/>
        <Route path='login' element={<SellerLogin/>}/>
        <Route element={<PrivateRoute/>}>
          <Route path='dashboard' element={<SellerDashboard />}/>
          <Route path='settings' element={<SellerSettings />}/>
        </Route>
    </Routes>
    </Provider>
  )
}

export default SellerRoute