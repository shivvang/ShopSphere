/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { fetchWishlist } from "../services/useProfile";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getWishlist() {
      const result = await fetchWishlist();

      if (result.error) {
        setError(result.error);
      } else {
        setWishlist(result.wishlist);
      }
    }

    getWishlist();
  }, []);

  
  return (
    <div className="min-h-screen bg-black text-white p-6">
    <h2 className="text-3xl font-bold text-white mb-4">Wishlist</h2>
    {error && <p className="text-red-500">{error}</p>}

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wishlist.length > 0 ? (
        wishlist.map((item) => (
          <Product key={item.productId} product={item} />
        ))
      ) : (
        <p className="text-gray-400">No items in wishlist</p>
      )}
    </div>
  </div>
  )
}

function Product({ product }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center transition-transform hover:scale-105">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-32 h-32 object-cover rounded-lg"
      />
      <h3 className="text-lg font-semibold text-black mt-2">{product.name}</h3>
      <p className="text-orange-600 font-bold text-xl mt-1">₹{product.price}</p>
      <button className="mt-3 bg-[#FF6F00] text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition">
        Remove from Wishlist
      </button>
    </div>
  );
}