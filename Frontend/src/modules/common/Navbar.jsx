/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; 

function Navbar({searchQuery,setSearchQuery}) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (event) => {
    if (event.key === "Enter") {
      navigate("/search"); 
    }
  };

  return (
    <nav className="bg-[#FF6F00] text-white px-6 py-4 flex items-center justify-between md:px-10">
      
      {/* Logo */}
      <h1 
        className="text-2xl font-bold cursor-pointer"
        onClick={() => navigate("/home")}
      >
        ShopSphere
      </h1>

      {/* Search Bar (Hidden on small screens) */}
      <div className="hidden md:flex flex-grow mx-4">
        <input 
          type="text" 
          placeholder="Search for products, brands and more"
          className="w-full p-2 rounded-lg text-black outline-none"
          onKeyDown={handleSearch} 
          value={searchQuery}
          onChange={(e)=>setSearchQuery(e.target.value)}
        />
      </div>

      {/* Desktop Profile Button */}
      <button 
        className="hidden md:block px-4 py-2 bg-white text-[#FF6F00] font-semibold rounded-lg hover:bg-gray-200"
        onClick={() => navigate("/profile")}
      >
        My Profile
      </button>

      {/* Mobile Menu Toggle */}
      <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-[#FF6F00] shadow-md flex flex-col items-center space-y-4 py-4 md:hidden">
          <input 
            type="text" 
            placeholder="Search..."
            className="w-11/12 p-2 rounded-lg text-black outline-none"
            value={searchQuery}
            onChange={(e)=>setSearchQuery(e.target.value)}
            onKeyDown={handleSearch} 
          />
          <button 
            className="px-4 py-2 bg-white text-[#FF6F00] font-semibold rounded-lg hover:bg-gray-200"
            onClick={() => navigate("/profile")}
          >
            My Profile
          </button>
        </div>
      )}
      
    </nav>
  );
}

export default Navbar;
