import { useState } from "react";
import { deleteSeller, logout, resetPassword } from "../services/useSeller";
import  {useNavigate} from "react-router-dom";

const SellerSettings = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const navigate = useNavigate();

    const handleLogout = async() => {
      const data = await logout();
      if(data.success){
        navigate("/seller")
      }
    };
  
    const handleResetPassword = async(e) => {
      e.preventDefault();

      const data = await resetPassword(oldPassword, newPassword);
      if(data.success){
       setOldPassword("");
       setNewPassword("");
      }
    };
  
    const handleDeleteAccount = async() => {
      const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
      if (confirmDelete) {
       const data = await deleteSeller();

       if (data.success){
        navigate("/seller");
       }  
      }
    };
  
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <div className="bg-white shadow-lg p-6 rounded-md border border-gray-300 w-full max-w-md">
          <h1 className="text-3xl font-bold text-[#FF6F00] mb-6 text-center">Seller Settings</h1>
  
        
          <button onClick={handleLogout} className="bg-[#FF6F00] text-white p-2 w-full rounded-md font-bold mb-4 hover:bg-[#e65c00] transition">
            Logout
          </button>
  
         
          <form onSubmit={handleResetPassword} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Reset Password</h2>
            <input 
              type="password" 
              placeholder="Old Password" 
              value={oldPassword} 
              onChange={(e) => setOldPassword(e.target.value)} 
              className="border border-gray-300 p-2 w-full rounded-md"
              required 
            />
            <input 
              type="password" 
              placeholder="New Password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              className="border border-gray-300 p-2 w-full rounded-md"
              required 
            />
            <button type="submit" className="bg-blue-600 text-white p-2 w-full rounded-md font-bold hover:bg-blue-700 transition">
              Reset Password
            </button>
          </form>
  
         
          <button onClick={handleDeleteAccount} className="bg-red-600 text-white p-2 w-full rounded-md font-bold mt-6 hover:bg-red-700 transition">
            Delete Account
          </button>
        </div>
      </div>
    );
  };

export default SellerSettings