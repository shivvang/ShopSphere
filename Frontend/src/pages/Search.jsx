/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
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
      sortOrder: "price_desc"
    })

    useEffect(() => {
      setSearchFilter((prevfilter)=>({...prevfilter,searchQuery:searchQuery}))
    },[searchQuery])
 

  const [products,setProducts] = useState([]);

  return (
    <div className="flex flex-col md:flex-row py-4 px-4 md:px-10 lg:px-44 gap-4  min-h-screen">
      <SearchFilter searchFilter={searchFilter} setSearchFilter={setSearchFilter} setProducts={setProducts} />
      <MainContent products={products} />
    </div>
  )
}

export default Search