import { useCallback, useState } from "react";
import {useNavigate} from "react-router-dom"
import { register } from "../services/useAuth.js";
import { StoreIcon } from "lucide-react";
import Spinner from "../modules/common/Spinner.jsx";
import toast from "react-hot-toast";

function Register() {
  const navigate = useNavigate();
  const [formData,setFormData] = useState({
    phone:"",
    email:"",
    password:"",
  });

  const [loading,setLoading] = useState(false);

  const handleChange = useCallback((e)=>{
    const {name,value} = e.target;
    setFormData((prev)=>({...prev,[name]:value}))
  },[]);

  const handleSubmit= useCallback(async(e)=>{
    e.preventDefault();

    if(loading) return;

    setLoading(true);
    const result = await register({ ...formData, setFormData });

    if (result.success) {
      setLoading(false);
      toast.success("You've successfully registered for ShopSphere!");
      navigate("/auth/login");
    } else {
      setLoading(false);
      toast.error(result.error);
    }
  },[loading,formData,navigate]);

  return (
    loading ? (<Spinner/>):(
    <div className="h-screen w-screen flex flex-col md:flex-row font-poppins">
      {/* Left Side - Branding Section */}
      <div className="flex flex-col justify-center items-center sm:gap-7  md:gap-10 w-full md:w-1/2 h-1/3 md:h-full bg-[#FF6F00] text-center p-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Looks like you&apos;re new here!</h1>
        <h3 className="text-white text-lg md:text-xl font-medium mt-2">
          Register using your mobile phone number and email address
        </h3>
        <h2 className="text-6xl font-extrabold text-black">Shop Sphere</h2>
      </div>

      {/* Right Side - Form Section */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 h-2/3 md:h-full p-6">
        <form className="flex flex-col gap-6 w-full max-w-md bg-white shadow-lg rounded-lg p-6 md:p-8 border" onSubmit={handleSubmit}>
          <input 
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#FF6F00]" 
            type="text" placeholder="Enter Mobile Number" 
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <input 
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#FF6F00]" 
            type="email" placeholder="Enter Email" 
            name="email"
            value={FormData.email}
            onChange={handleChange}
          />
          <input 
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#FF6F00]" 
            type="password" placeholder="Enter Password" 
            name="password"
            value={formData.password}
            onChange={handleChange}
          />

          <button className="w-full bg-[#FF6F00] text-white py-3 rounded-md font-semibold hover:bg-[#e65c00] transition">
            Register
          </button>
          <button 
            onClick={() => navigate("/auth/login")} 
            className="w-full text-[#FF6F00] border border-[#FF6F00] py-3 rounded-md font-semibold hover:bg-[#FF6F00] hover:text-white transition"
          >
            Existing User? Log in
          </button>
        </form>
        <div className="flex items-center mt-6 md:mt-8 cursor-pointer hover:text-[#FF6F00] transition-colors" onClick={()=>navigate("/seller/")}>
          <StoreIcon className="mr-2" /> 
           Become a Seller
        </div>
      </div>
    </div>
    )
  );
}

export default Register