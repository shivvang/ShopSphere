import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, resetPassword } from '../services/useAuth';
import toast from 'react-hot-toast';
import Spinner from '../modules/common/Spinner';


function AccountSettings() {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading,setloading] = useState(false);

  const handleResetPassword = async(e) => {

    e.preventDefault();

    if(loading) return;

    setloading(true);

    const result = await resetPassword(oldPassword,newPassword);

    if(result.success){
      setloading(false);
      toast.success("success reset");
      setOldPassword("");
      setNewPassword("");
    }else{
      setloading(false);
      toast.error(result.error);
    }

  };

  const handleLogout = async() => {

    if(loading) return;

    setloading(true);

    const result = await logout();

    if(result.success){
      setloading(false);
      toast.success("success full logout");
      navigate("/auth"); 
    }else{
      setloading(false);
      toast.error(result.error);
    }
  };

  const handleGoBack = () => {
    navigate(-1); 
  };

  return (
    <>
    {loading && <Spinner/>}
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-6">Account Settings</h2>

       
        <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF6F00]"
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF6F00]"
            required
          />
          <button
            type="submit"
            className="bg-[#FF6F00] text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition duration-200"
          >
            Reset Password
          </button>
        </form>

      
        <button
          onClick={handleLogout}
          className="mt-4 bg-black text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-800 transition duration-200 w-full"
        >
          Logout
        </button>

       
        <button
          onClick={handleGoBack}
          className="mt-4 text-[#FF6F00] font-bold py-2 px-4 rounded-lg border border-[#FF6F00] hover:bg-[#FF6F00] hover:text-white transition duration-200 w-full"
        >
          Back
        </button>
      </div>
    </div>
    </>
  );
}

export default AccountSettings;
