/* eslint-disable react/prop-types */
function ListOfProduct({ products }) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl p-4"
          >
            <img
              className="w-full h-40 object-cover rounded-md"
              src={p.url}
              alt="Product"
            />
            <div className="mt-2 flex flex-col items-center">
              <span className="text-lg font-semibold text-gray-700">₹   {p.price}</span>
              <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                Add to Wishlist
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  export default ListOfProduct;