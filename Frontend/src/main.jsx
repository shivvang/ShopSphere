import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from "react-router-dom"
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './modules/common/ErrorBoundary.jsx'
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 4000 }} />
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
