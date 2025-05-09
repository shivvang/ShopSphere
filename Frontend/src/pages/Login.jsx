import { useCallback, useState } from "react";
import { login } from "../services/useAuth";
import {useNavigate} from "react-router-dom"
import toast from "react-hot-toast";
import Spinner from "../modules/common/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { signInRequest, signInSuccess, signOutFailure } from "../redux/Customer/features/customerAuthSliceReducer";



function Login() {

    const [formData, setFormData] = useState({
        email:"",
        password:"",
    })

    const {loading} =  useSelector((state)=>state.customer);

  
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = useCallback((e)=>{
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    },[])

    const handleSubmit = useCallback(async(e)=>{
      e.preventDefault();

      dispatch(signInRequest());

      const result = await login({...formData,setFormData});

      if (result.success) {
        dispatch(signInSuccess(result.customer))
       
        toast.success(`"Welcome back"`);
        navigate("/home");
      } else {
        dispatch(signOutFailure());
        toast.error(result.error);
      }

    },[dispatch,formData,navigate])

    if(loading) return <Spinner/>;

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
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <input 
                className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#FF6F00]" 
                type="password" placeholder="Enter Password" 
                name="password"
                value={formData.password}  
                onChange={handleChange} 
              />
              <button 
                className="w-full text-[#FF6F00] border border-[#FF6F00] py-3 rounded-md font-semibold hover:bg-[#FF6F00] hover:text-white transition"
                type="button"
                onClick={()=>navigate("/auth/register")}
              >
               Register Instead
              </button>
              <button className="w-full bg-[#FF6F00] text-white py-3 rounded-md font-semibold hover:bg-[#e65c00] transition">
                Login
              </button>
            </form>
          </div>
        </div>
      );
}

export default Login