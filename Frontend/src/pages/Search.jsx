import Navbar from "../modules/common/Navbar"
import MainContent from "../modules/Search/MainContent"
import SearchFilter from "../modules/Search/SearchFilter"


function Search() {
  return (
    <div className="flex flex-col h-screen w-screen">
    <Navbar/>
    <div className="flex py-4 px-44 gap-2 overflow-x-hidden">
        <SearchFilter/>
        <MainContent/>
    </div>
   </div>
  )
}

export default Search