import { Link, Outlet } from "react-router-dom";


export default function Profile() {
  return (
    <div className="flex flex-col h-screen">
    
      <div className="flex flex-1">
       
      <aside className="w-1/4 bg-white p-6 border-r border-gray-300">
      <h2 className="text-xl font-semibold mb-6 text-black">Profile Options</h2>
      <ul className="space-y-4">
        <li>
          <Link
            to="wishlist"
            className="block text-black text-lg font-medium transition-colors duration-200 hover:text-[#FF6F00] hover:pl-2"
          >
            📋 Wishlist
          </Link>
        </li>
        <li>
          <Link
             to="cart"
            className="block text-black text-lg font-medium transition-colors duration-200 hover:text-[#FF6F00] hover:pl-2"
          >
            🛒 Cart
          </Link>
        </li>
        <li>
          <Link
             to="orders"
            className="block text-black text-lg font-medium transition-colors duration-200 hover:text-[#FF6F00] hover:pl-2"
          >
            📦 Orders
          </Link>
        </li>
        <li>
          <Link
             to="settings" 
            className="block text-[#FF6F00] text-lg font-medium transition-colors duration-200 hover:text-black hover:pl-2"
          >
            ⚙️ Account Settings
          </Link>
        </li>
      </ul>
        </aside>
        <main className="w-3/4 p-6">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}
