import {useNavigate} from "react-router-dom"

function SellerRegister() {
    const navigate = useNavigate();
  return (
    <div className="h-screen w-screen flex flex-col md:flex-row font-poppins">
    <div className="flex flex-col justify-center items-center sm:gap-7 md:gap-10 w-full md:w-1/2 h-1/3 md:h-full bg-[#FF6F00] text-center p-6">
      <h1 className="text-3xl md:text-4xl font-bold text-white">
        Become a Merchant!
      </h1>
      <h3 className="text-white text-lg md:text-xl font-medium mt-2">
        Create your merchant account using your mobile number, email, and shop details.
      </h3>
      <h2 className="text-6xl font-extrabold text-black">Shop Sphere</h2>
    </div>

    <div className="flex flex-col justify-center items-center w-full md:w-1/2 h-2/3 md:h-full p-6">
      <form className="flex flex-col gap-6 w-full max-w-md bg-white shadow-lg rounded-lg p-6 md:p-8 border">
        <input
          className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#FF6F00]"
          type="text"
          placeholder="Enter Mobile Number"
        />
        <input
          className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#FF6F00]"
          type="email"
          placeholder="Enter Email"
        />
        <input
          className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#FF6F00]"
          type="text"
          placeholder="Enter Shop Name"
        />
        <input
          className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#FF6F00]"
          type="password"
          placeholder="Enter Password"
        />

        <button className="w-full bg-[#FF6F00] text-white py-3 rounded-md font-semibold hover:bg-[#e65c00] transition">
          Register as Merchant
        </button>
        <button
          onClick={() => navigate("/seller/login")}
          className="w-full text-[#FF6F00] border border-[#FF6F00] py-3 rounded-md font-semibold hover:bg-[#FF6F00] hover:text-white transition"
        >
          Already a Merchant? Log in
        </button>
      </form>
    </div>
  </div>
  )
}

export default SellerRegister