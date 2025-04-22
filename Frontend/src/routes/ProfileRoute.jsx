import { lazy} from 'react';
import {Routes,Route, Navigate} from "react-router-dom";

const Profile = lazy(()=>import("../pages/Profile"));
const Wishlist = lazy(()=>import("../modules/Profile/Wishlist"));
const Cart = lazy(()=>import("../modules/Profile/Cart"));
const Orders =  lazy(()=>import("../modules/Profile/Orders"));
const AccountSettings = lazy(()=>import("../modules/Profile/AccountSettings"));

function ProfileRoute() {
    return (
      <Routes>
        <Route path="/" element={<Profile />}>
          <Route index element={<Navigate to="settings" replace />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="cart" element={<Cart />} />
          <Route path="orders" element={<Orders />} />
          <Route path="settings" element={<AccountSettings />} />
        </Route>
      </Routes>
    );
  }
  
  export default ProfileRoute;