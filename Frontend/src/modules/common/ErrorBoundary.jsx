/* eslint-disable react/prop-types */
import {Component} from "react"

class ErrorBoundary extends Component {
    constructor(props){
        super(props)
        this.state =  { hasError: false, error: null };
    }

    static getDerivedStateFromError(error){
         // Update state so next render shows the fallback UI
    return { hasError: true, error };
    }

    componentDidCatch(error,info){
        console.error("Error caught in boundary:", error, info);
    }

    render(){
        if (this.state.hasError) {
            return (
              <div className="h-screen flex items-center justify-center bg-black text-white">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-[#FF6F00]">
                    Something went wrong.
                  </h1>
                  <p className="text-gray-400 mt-2">{this.state.error?.message}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-[#FF6F00] text-black rounded-lg hover:bg-[#e65c00]"
                  >
                    Reload Page
                  </button>
                </div>
              </div>
            );
          }
          
          return this.props.children;
    }

}

export default ErrorBoundary;