/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { fetchWishlist } from "../services/useProfile";
import { clearWishlistItem, removeWishlistItem } from "../services/useShopping";
import {toast} from "react-hot-toast"
import Spinner from "../modules/common/Spinner";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  async function getWishlist() {
    const result = await fetchWishlist();

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Here are the items in your wishlist")
      setWishlist(result.wishlist);
    }
  }


  useEffect(() => {
    getWishlist();
  }, []);

  const handleClearWishlist = async () => {
    if (loading) return;
  
    setLoading(true);
  
   
    setWishlist([]);
  
    const response = await clearWishlistItem();
  
    if (response.success) {
      toast.success("Cleared wishlist");
  
     
      setTimeout(async () => {
        const updatedWishlist = await fetchWishlist();
        setWishlist(updatedWishlist.wishlist);
      }, 500);
    } else {
      toast.error(response.error);
    }
  
    setLoading(false);
  };

  const removeFromWishlist = async (productId) => {
    if (loading) return;
  
    setLoading(true);
  
    
    setWishlist((prev) => prev.filter((item) => item.productId !== productId));
  
    const response = await removeWishlistItem(productId);
  
    if (response.success) {
      toast.success("Removed from wishlist");
  
   
      setTimeout(async () => {
        const updatedWishlist = await fetchWishlist();
        setWishlist(updatedWishlist.wishlist);
      }, 500); 
    } else {
      toast.error(response.error);
    }
  
    setLoading(false);
  };
  
  return (
    <>
    {loading && <Spinner/>}
    <div className="min-h-screen bg-black text-white p-6">
      <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-white">Wishlist</h2>
          {wishlist.length > 0 && (
            <button
              onClick={handleClearWishlist}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Clear All
            </button>
          )}
        </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wishlist.length > 0 ? (
        wishlist.map((item) => (
          <Product key={item.productId} product={item} removeFromWishlist={removeFromWishlist} />
        ))
      ) : (
        <p className="text-gray-400">No items in wishlist</p>
      )}
    </div>
  </div>
  </>
  )
}

function Product({ product ,removeFromWishlist}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center transition-transform hover:scale-105">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-32 h-32 object-cover rounded-lg"
      />
      <h3 className="text-lg font-semibold text-black mt-2">{product.name}</h3>
      <p className="text-orange-600 font-bold text-xl mt-1">₹{product.price}</p>
      <button className="mt-3 bg-[#FF6F00] text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition" onClick={()=>removeFromWishlist(product.productId)}>
        Remove from Wishlist
      </button>
    </div>
  );
}