/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { fetchWishlist } from "../../services/useProfile";
import { clearWishlistItem, removeWishlistItem } from "../../services/useShopping";
import {toast} from "react-hot-toast"
import Spinner from "../common/Spinner";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  async function getWishlist() {
    const result = await fetchWishlist();

    if (result.error) {
      toast.error(result.error);
    } else {
      setWishlist(result.wishlist);
    }
  }


  useEffect(() => {
    getWishlist();
  }, []);

  const handleClearWishlist = async () => {
    if (loading) return;
  
    setLoading(true);
  
    const response = await clearWishlistItem();
  
    if (response.success) {
      toast.success("Cleared wishlist");
      setWishlist([]);
    } else {
      toast.error(response.error);
    }
  
    setLoading(false);
  };

  const removeFromWishlist = async (productId) => {
    if (loading) return;
  
    setLoading(true);
  
    const response = await removeWishlistItem(productId);
  
    if (response.success) {
      toast.success("Removed from wishlist");
      setWishlist((prev) => prev.filter((item) => item.productId !== productId));
    } else {
      toast.error(response.error);
    }
  
    setLoading(false);
  };
  
  return (
    loading ? ( <Spinner/>):(
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
    )
  )
}

function Product({ product ,removeFromWishlist}) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center text-center transition-transform hover:scale-105 hover:shadow-2xl duration-300 ease-in-out w-full max-w-sm mx-auto">
      
      <div className="w-full h-48 overflow-hidden rounded-xl">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mt-4">{product.name}</h3>
      <p className="text-gray-500 text-sm mt-1">{product.brand}</p>

      <p className="text-orange-600 font-extrabold text-xl mt-2">₹{product.price}</p>

      <button
        onClick={() => removeFromWishlist(product.productId)}
        className="mt-4 w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 shadow hover:shadow-md transition-all duration-300"
      >
        Remove from Wishlist
      </button>
    </div>
  );
}