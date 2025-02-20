/* eslint-disable react/prop-types */

import { useState } from "react";
import MainContent from "../modules/Search/MainContent"
import SearchFilter from "../modules/Search/SearchFilter"


function Search({searchQuery}) {

  const [searchFilter,setSearchFilter] = useState(
    {
      searchQuery: searchQuery,
      category:"",
      brand:"",
      discount:"",
      price:"",
      rating:"",
      sortOrder: "desc"
    })

    console.log("search filter here ",searchFilter);

  const [products,setProducts] = useState([]);


  console.log("products found here are",products);

  return (
    <div className="flex flex-col h-screen w-screen">
    <div className="flex py-4 px-44 gap-2 overflow-x-hidden">
        <SearchFilter searchFilter={searchFilter} setSearchFilter={setSearchFilter} setProducts={setProducts}/>
        <MainContent products={products}/>
    </div>
   </div>
  )
}

export default Search