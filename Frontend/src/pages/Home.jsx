
import { useEffect } from "react";
import MainContent from "../modules/Home/MainContent";
import { GetRecommendations } from "../services/useAuth";
import {useSelector} from "react-redux";



function Home() {
  const {currentCustomer} = useSelector((state)=>state.customer);

  useEffect(()=>{
    const callforRecommendation = async()=>{
      console.log("im calling for recommendation");
      const response = await GetRecommendations(currentCustomer.id);
      if(response.success){
        console.log(response.products);
      }
    }

    callforRecommendation();
  },[]);

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
    <MainContent />
  </div>
  )
}

export default Home 