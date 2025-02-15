
import MainContent from "../modules/Home/MainContent"
import Navbar from "../modules/common/Navbar"



function Home() {
  return (
    <div className="flex flex-col h-screen w-screen">
        <Navbar/>
        <MainContent/>
    </div>
  )
}

export default Home 