import { useState } from "react";
import { deleteSeller, logout, resetPassword } from "../services/useSeller";
import  {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import Spinner from "../modules/common/Spinner";

const SellerSettings = () => {
    const [passwords,setPasswords] = useState({
      oldPassword:"",
      newPassword:""
    })

    const handlePasswordChange = (e) => {
      const { name, value } = e.target;
      setPasswords((prev) => ({ ...prev, [name]: value }));
    };

    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async() => {
      if (loading) return;
      try{
        setLoading(true);
        const data = await logout();
        if(data.success){
          toast.success("You have been logged out successfully.");
          navigate("/seller")
        }else{
          toast.error(data.error);
        }
      }
      finally{
        setLoading(false);
      }
    };
  
    const handleResetPassword = async(e) => {
      e.preventDefault();

      if(loading) return;

      try{
        setLoading(true);

      const data = await resetPassword(oldPassword, newPassword);
      if(data.success){
        toast.success("Password updated successfully. Please use the new password to log in.");
        setOldPassword("");
        setNewPassword("");
      }else{
        toast.error(data.error);
      }
      }finally{
        setLoading(false);
      }
    };
  
    const handleDeleteAccount = async() => {
      if(loading) return;
      const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
      if (confirmDelete) {
       try{
        setLoading(true);
        const data = await deleteSeller();
 
        if (data.success){
         toast.success("Account deleted. We're sorry to see you go!");
         navigate("/seller");
        }else{
         toast.error(data.error);
        }  
       }finally{
        setLoading(false);
       }
      }
    };

    const handleGoBack = () => {
      navigate(-1); // Navigates to the previous page in history
    };

    if(loading) return <Spinner/>
  
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <div className="bg-white shadow-lg p-6 rounded-md border border-gray-300 w-full max-w-md">
          <h1 className="text-3xl font-bold text-[#FF6F00] mb-6 text-center">Seller Settings</h1>
          <button onClick={handleGoBack} className="bg-gray-500 text-white p-2 w-full rounded-md font-bold mb-4 hover:bg-gray-600 transition">
            Go Back
          </button>
        
          <button onClick={handleLogout} className="bg-[#FF6F00] text-white p-2 w-full rounded-md font-bold mb-4 hover:bg-[#e65c00] transition">
            Logout
          </button>
  
         
          <form onSubmit={handleResetPassword} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Reset Password</h2>
            <input 
              type="password" 
              name="oldPassword"
              placeholder="Old Password" 
              value={passwords.oldPassword} 
              onChange={handlePasswordChange} 
              className="border border-gray-300 p-2 w-full rounded-md"
              required 
            />
            <input 
              type="password" 
              name="newPassword"
              placeholder="New Password" 
              value={passwords.newPassword} 
              onChange={handlePasswordChange} 
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