/* eslint-disable react/prop-types */

import { searchProducts } from "../../services/useProduct";


function SearchFilter({searchFilter,setSearchFilter,setProducts}) {

  const handleSubmit = async(e) => {
    e.preventDefault(); 

    const  result = await searchProducts({...searchFilter});

    setProducts(result.products);
  }

  return (
    <div className="w-[30%] h-full p-4 border-r border-gray-300">
      <h1 className="text-lg font-bold mb-2">Filters</h1>
      <hr className="mb-4" />

      {/* ✅ Add onSubmit handler here */}
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
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>

        {/* ✅ Add a Submit Button */}
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