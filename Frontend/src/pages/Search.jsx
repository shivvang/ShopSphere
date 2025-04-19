/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import MainContent from "../modules/Search/MainContent"
import SearchFilter from "../modules/Search/SearchFilter"
import { useLocation,useNavigate  } from "react-router-dom";

function Search({searchQuery}) {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromURL = queryParams.get("category") || "";

  const [searchFilter,setSearchFilter] = useState(
    {
      searchQuery: searchQuery,
      category:categoryFromURL,
      brand:"",
      discount:"",
      price:"",
      rating:"",
      sortOrder: "price_desc"
    })

    useEffect(() => {
      setSearchFilter((prevfilter)=>({...prevfilter,searchQuery:searchQuery}))
    },[searchQuery])

    useEffect(() => {
      if (categoryFromURL) {
        const newParams = new URLSearchParams(location.search);
        newParams.delete("category");
  
        navigate(
          {
            pathname: location.pathname,
            search: newParams.toString(),
          },
          { replace: true }
        );
      }
    }, []);
  const [products,setProducts] = useState([]);

  return (
    <div className="flex flex-col md:flex-row py-4 px-4 md:px-10 lg:px-44 gap-4  min-h-screen">
      <SearchFilter searchFilter={searchFilter} setSearchFilter={setSearchFilter} setProducts={setProducts} products={products} />
      <MainContent products={products} />
    </div>
  )
}

export default Search