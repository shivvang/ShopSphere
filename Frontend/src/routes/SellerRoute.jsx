import { lazy} from 'react';
import {Provider} from "react-redux"
import { Navigate, Route, Routes } from 'react-router-dom'

const SellerRegister =  lazy(()=>import('../pages/SellerRegister.jsx'));
const SellerLogin = lazy(()=>import('../pages/SellerLogin.jsx')); 
const SellerDashboard = lazy(()=>import('../pages/SellerDashboard.jsx')); 
const SellerSettings = lazy(()=>import('../pages/SellerSettings.jsx'));

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