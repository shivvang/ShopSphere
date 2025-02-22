import { useState } from "react";
import { login } from "../services/useAuth";
import {useNavigate} from "react-router-dom"

function Login() {

    const [formData, setFormData] = useState({
        email:"",
        password:"",
    })

    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async(e)=>{
      e.preventDefault();

      const result = await login({...formData,setFormData});

      if (result.success) {
        navigate("/home");
      } else {
        setError(result.error);
      }

    }

    return (
        <div className="h-screen w-screen flex flex-col md:flex-row font-poppins">
       
          <div className="flex flex-col justify-center items-center sm:gap-7  md:gap-10 w-full md:w-1/2 h-1/3 md:h-full bg-[#FF6F00] text-center p-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Login</h1>
            <h3 className="text-white text-lg md:text-xl font-medium mt-2">
              Get access to your Orders , Wishlist and Cart
            </h3>
            <h2 className="text-6xl font-extrabold text-black">Shop Sphere</h2>
          </div>
    
         
          <div className="flex flex-col justify-center items-center w-full md:w-1/2 h-2/3 md:h-full p-6">
            <form className="flex flex-col gap-6 w-full max-w-md bg-white shadow-lg rounded-lg p-6 md:p-8 border"  onSubmit={handleSubmit}>
              <input 
                className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#FF6F00]" 
                type="email" placeholder="Enter Email" 
                value={formData.email}
                onChange={(e)=>setFormData((prev)=>({...prev,email:e.target.value}))}
              />
              <input 
                className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#FF6F00]" 
                type="password" placeholder="Enter Password" 
                value={formData.password}  
                onChange={(e)=>setFormData((prev)=>({...prev,password:e.target.value}))} 
              />
    
              <button className="w-full bg-[#FF6F00] text-white py-3 rounded-md font-semibold hover:bg-[#e65c00] transition">
                Login
              </button>
            </form>
          </div>
        </div>
      );
}

export default Login