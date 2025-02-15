
function Navbar() {
    return (
      <nav className="flex items-center justify-between p-4 bg-[#FF6F00] text-white">
        
        <h1 className="text-2xl font-bold">ShopSphere</h1>
  
       
        <div className="flex-grow mx-4">
          <input 
            type="text" 
            placeholder="Search for products, brands and more" 
            className="w-full p-2 rounded-lg text-black  outline-none"
          />
        </div>
  
            
        <button className="px-4 py-2 bg-white text-[#FF6F00] font-semibold rounded-lg hover:bg-gray-200">
          My Profile
        </button>
      </nav>
    );
  }
  
  export default Navbar;
