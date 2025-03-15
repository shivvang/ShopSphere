/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import { searchProducts } from "../../services/useProduct";
import {toast} from "react-hot-toast"

function SearchFilter({searchFilter,setSearchFilter,setProducts}) {
  
  const [loading,setLoading ] = useState(false);

  const fetchProducts = async () => {
    if (loading) return;

    setLoading(true);

    const result = await searchProducts({ ...searchFilter });

    if (result.products) {
      setLoading(false);
      toast.success("Fetched products successfully");
      setProducts(result.products);
    } else {
      setLoading(false);
      toast.error(result.error);
    }
  };

//   Step-by-Step Execution (simple yet crazy insane)
// 1)The component renders.
// 2)The useEffect runs:
// 3)setTimeout starts a 500ms delay.
// 4)User types a new character → searchFilter.searchQuery updates.
// 5)Since searchFilter.searchQuery changed, useEffect runs again:
// 6)clearTimeout(timeout) cancels the previous timeout.
// 7)A new setTimeout starts.
// 8)This cycle repeats until the user stops typing.
// 9)After 500ms of inactivity, fetchProducts() finally runs once.
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchProducts();
    }, 500);
  
    return () => clearTimeout(timeout);
  }, [searchFilter.searchQuery]);

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="w-full md:w-[40%] lg:w-[30%] h-auto p-4 border-b md:border-r md:border-b-0 border-gray-300">
    <h1 className="text-lg font-bold mb-2">Filters</h1>
    <hr className="mb-4" />
  
    <form onSubmit={handleSubmit}>
      <label className="block mb-2 font-semibold">Price</label>
      <input
        type="number"
        name="price"
        value={searchFilter.price}
        onChange={(e) => setSearchFilter((prev) => ({ ...prev, price: e.target.value }))}
        placeholder="Enter max price"
        className="w-full p-2 border rounded mb-4"
      />
  
      <label className="block mb-2 font-semibold">Discount (%)</label>
      <input
        type="number"
        name="discount"
        value={searchFilter.discount}
        onChange={(e) => setSearchFilter((prev) => ({ ...prev, discount: e.target.value }))}
        placeholder="Min discount %"
        className="w-full p-2 border rounded mb-4"
      />
  
      <label className="block mb-2 font-semibold">Category</label>
      <select
        name="category"
        value={searchFilter.category}
        onChange={(e) => setSearchFilter((prev) => ({ ...prev, category: e.target.value }))}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="fashion">Fashion</option>
        <option value="home">Home</option>
      </select>
  
      <label className="block mb-2 font-semibold">Brand</label>
      <input
        type="text"
        name="brand"
        value={searchFilter.brand}
        onChange={(e) => setSearchFilter((prev) => ({ ...prev, brand: e.target.value }))}
        placeholder="Enter brand name"
        className="w-full p-2 border rounded mb-4"
      />
  
      <label className="block mb-2 font-semibold">Sort By</label>
      <select
        name="sortOrder"
        value={searchFilter.sortOrder}
        onChange={(e) => setSearchFilter((prev) => ({ ...prev, sortOrder: e.target.value }))}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>
  
      <button
        type="submit"
        className="w-full bg-[#FF6F00] text-white py-2 rounded-lg mt-2 hover:bg-[#e65c00]"
      >
        Apply Filters
      </button>
    </form>
  </div>
  
  )
}

export default SearchFilter