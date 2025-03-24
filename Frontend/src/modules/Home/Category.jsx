const categories = [
  "Kilos",
  "Mobiles",
  "Fashion",
  "Electronics",
  "Home & Furnitures",
  "Appliances",
  "Flight Bookings",
  "Beauty, Toys & More",
  "Two Wheelers",
];

export default function Category() {
  return (
    <div className="flex gap-4 overflow-x-auto whitespace-nowrap py-3 scrollbar-thin scrollbar-thumb-[#FF6F00] scrollbar-track-gray-900">
      {categories.map((category, index) => {
        // ✅ Create a varying size for the bento-style look
        const sizeClass =
          index % 3 === 0
            ? "text-lg px-6 py-3"
            : index % 3 === 1
            ? "text-md px-5 py-2"
            : "text-sm px-4 py-2";

        return (
          <span
            key={index}
            className={`bg-[#FF6F00] ${sizeClass} text-white rounded-md shadow-md cursor-pointer hover:bg-[#e65c00] transition-all hover:scale-105 active:scale-95 select-none`}
            style={{
              borderRadius: index % 2 === 0 ? "12px 24px 12px 24px" : "24px 12px 24px 12px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
            }}
          >
            {category}
          </span>
        );
      })}
    </div>
  );
}
