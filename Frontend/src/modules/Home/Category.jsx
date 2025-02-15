const temp =[
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
    <div className="flex items-center justify-evenly">
        {temp.map((item)=><span key={item.id}>{item.category}</span>)}
    </div>
  )
}

export default Category


