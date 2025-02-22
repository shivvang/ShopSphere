import { Navigate, Route, Routes } from 'react-router-dom'
import AuthRoute from './routes/AuthRoute.jsx'
import Home from './pages/Home.jsx'
import Search from './pages/Search.jsx'
import ProfileRoute from './routes/ProfileRoute.jsx'
import Navbar from './modules/common/Navbar.jsx'
import { useLocation } from "react-router-dom";
import { useState } from 'react'
import SellerRoute from './routes/SellerRoute.jsx'

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/auth") || location.pathname.startsWith("/seller");
  const [searchQuery,setSearchQuery] = useState("");
  return (
    <div className="overflow-hidden flex flex-col h-screen">
  {!hideNavbar && <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>}  
  <div className="flex-grow overflow-y-auto overflow-x-hidden h-0">
    <Routes>
    <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/auth/*" element={<AuthRoute />} />
      <Route path="/seller/*" element={<SellerRoute />} />
      <Route path="/home" element={<Home />} />
      <Route path="/search" element={<Search  searchQuery={searchQuery}/>} />
      <Route path="/profile/*" element={<ProfileRoute />} />
    </Routes>
  </div>
</div>

  );
}

export default App;