import Logo from "../assets/shopSphere.png"
import {useNavigate} from "react-router-dom"

function Register() {
  const navigate = useNavigate();
  
  return (
    <div className="h-screen w-screen flex flex-col md:flex-row font-poppins">
      {/* Left Side - Branding Section */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 h-1/3 md:h-full bg-[#FF6F00] text-center p-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Looks like you&apos;re new here!</h1>
        <h3 className="text-white text-lg md:text-xl font-medium mt-2">
          Register using your mobile phone number and email address
        </h3>
        <img className="h-24 md:h-40 w-auto mt-4" src={Logo} alt="ShopSphere Logo" />
      </div>

      {/* Right Side - Form Section */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 h-2/3 md:h-full p-6">
        <form className="flex flex-col gap-6 w-full max-w-md bg-white shadow-lg rounded-lg p-6 md:p-8 border">
          <input 
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#FF6F00]" 
            type="text" placeholder="Enter Mobile Number" 
          />
          <input 
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#FF6F00]" 
            type="email" placeholder="Enter Email" 
          />
          <input 
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#FF6F00]" 
            type="password" placeholder="Enter Password" 
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
      </div>
    </div>
  );
}

export default Register