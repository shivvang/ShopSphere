const categories =[
    {
        id:1,
        category:"kilos",
    },
    {
        id:2,
        category:"Mobiles",
    },
    {
        id:3,
        category:"Fashion",
    },
    {
        id:4,
        category:"Electronics",
    },
    {
        id:5,
        category:"Home & furnitures",
    },
    {
        id:6,
        category:"Appliances",
    },
    {
        id:7,
        category:"Flight Bookings",
    },
    {
        id:8,
        category:"Beauty , Toys & More",
    },
    {
        id:9,
        category:"Two Wheelers",
    },
]

function Category() {
  return (
    <div className="w-full overflow-x-auto whitespace-nowrap flex gap-4 py-2 px-2 md:flex-wrap md:justify-center">
      {categories.map((item) => (
        <span
          key={item.id}
          className="bg-[#FF6F00] text-white px-4 py-2 rounded-md shadow-md cursor-pointer hover:bg-[#e65c00] transition"
        >
          {item.category}
        </span>
      ))}
    </div>
  )
}

export default Category


