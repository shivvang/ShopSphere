import { useState, useEffect } from "react";
import { createProduct, deleteProduct, removeImageFromAWS, updateProduct, uploadFileAndGetUrl } from "../services/useProduct";
import { getSellerProducts, refreshAccessToken } from "../services/useSeller";
import {Link,useNavigate}  from "react-router-dom"
import { useSelector,useDispatch } from "react-redux";
import { signOutSuccess, updateLoginTime } from "../redux/Seller/Features/sellerAuthSliceReducer";
import Spinner from "../modules/common/Spinner";
import toast from "react-hot-toast";

function SellerDashboard() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    price: "",
    discount: "",
    category: "",
    brand: "",
    tags: "",
    searchKeywords: "",
  });
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading,setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    if (loading) return; // Prevent multiple requests

    setLoading(true);
    try {
      const data = await getSellerProducts();
      if (data.success) {
        setProducts(data.products);
        toast.success("Fetched all products");
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    e.persist();
    const file = e.target.files[0];
    if (!file || loading) return;
    setLoading(true);
    try {
      console.log("Selected file main bhi hain:", file);
      const uploadResponse = await uploadFileAndGetUrl(file);
      if (uploadResponse.success) {
        setFormData((prev) => ({ ...prev, imageUrl: uploadResponse.fileUrl }));
        toast.success("Image uploaded successfully");
      } else {
        toast.error(uploadResponse.error);
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!formData.imageUrl || loading) return;
    setLoading(true);
    try {
      const response = await removeImageFromAWS(formData.imageUrl);
      if (response.success) {
        setFormData((prev) => ({ ...prev, imageUrl: "" }));
        toast.success("Image removed");
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      let response;
      if (editingProduct) {
        response = await updateProduct(editingProduct.id, formData);
        if (response.success) {
          toast.success("Product updated successfully");
        } else {
          toast.error(response.error);
        }
      } else {
        response = await createProduct(formData);
        if (response.success) {
          toast.success("Product created successfully");
        } else {
          toast.error(response.error);
        }
      }
      resetForm();
      fetchProducts();
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await deleteProduct(productId);
      if (response.success) {
        toast.success("Product deleted");
        fetchProducts(); // Refresh products after deletion
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      imageUrl: "",
      price: "",
      discount: "",
      category: "",
      brand: "",
      tags: "",
      searchKeywords: "",
    });
    setEditingProduct(null);
  };

  const {loginTime} = useSelector((state)=>state.seller);

  useEffect(() => {
    if (!loginTime) return; // If no login time, do nothing

    const expiryTime =  2 * 60 * 60 * 1000; // 2 hours in milliseconds
    const remainingTime = expiryTime - (Date.now() - loginTime);

    const refreshToken = async () => {
        setLoading(true);
        const response = await refreshAccessToken();
        setLoading(false);
        
        if (response.error) {
            dispatch(signOutSuccess());
            navigate("/seller/login");
            toast.error("Session expired. Please log in again.");
        } else {
            dispatch(updateLoginTime())
            toast.success("Session refreshed.");
        }
    };

    if (remainingTime <= 0) {
        refreshToken(); // Refresh immediately if expired
    } else {
      console.log("Setting timeout for refresh in:", remainingTime / 1000, "seconds");
        const timer = setTimeout(() => {
            refreshToken(); // Refresh when time is up
        }, remainingTime);

        return () => clearTimeout(timer); // Cleanup timer on unmount
    }
}, [loginTime]);

 
  return (
    <>
     {loading && <Spinner/>}
    <div className="p-6 bg-white min-h-screen text-black">
      <h1 className="text-3xl font-bold text-[#FF6F00] mb-4">Manage Products</h1>
      <Link to="/seller/settings" className="fixed bottom-4 right-4 bg-[#FF6F00] text-white p-3 rounded-full shadow-lg hover:bg-[#e65c00] transition">⚙️</Link>
      <form className="bg-white shadow-lg p-6 rounded-md border border-[#FF6F00]" onSubmit={handleSubmit}>
        <input type="text" name="name" value={formData.name } onChange={handleChange} disabled={editingProduct} placeholder="Product Name" className="border border-[#FF6F00] p-2 w-full mb-2"  />
        <textarea name="description" value={formData.description } onChange={handleChange} placeholder="Description" className="border border-[#FF6F00] p-2 w-full mb-2"  />
        <input type="number" name="price" value={formData.price } onChange={handleChange} placeholder="Price" className="border border-[#FF6F00] p-2 w-full mb-2"  />
        <input type="number" name="discount" value={formData.discount } onChange={handleChange} placeholder="discount" className="border border-[#FF6F00] p-2 w-full mb-2"  />
        <input type="text" name="category" value={formData.category } onChange={handleChange} disabled={editingProduct} placeholder="Category" className="border border-[#FF6F00] p-2 w-full mb-2"  />
        <input type="text" name="brand" value={formData.brand } onChange={handleChange} disabled={editingProduct} placeholder="Brand" className="border border-[#FF6F00] p-2 w-full mb-2"  />
        <input type="text" name="tags" value={formData.tags } onChange={(e)=>setFormData((prev)=>({...prev,tags:e.target.value}))} placeholder="Tags (comma-separated)" className="border border-[#FF6F00] p-2 w-full mb-2" />
        <input type="text" name="searchKeywords" value={formData.searchKeywords } onChange={handleChange} placeholder="Search Keywords (comma-separated)" className="border border-[#FF6F00] p-2 w-full mb-2" />
        <input type="file" onChange={handleImageUpload} className="p-2 w-full bg-white text-black mb-2 border border-[#FF6F00]" accept="image/*" />
        {formData.imageUrl  && (
          <div className="flex items-center gap-4">
            <img src={formData.imageUrl} alt="Preview" className="w-24 h-24 object-cover rounded-md mb-2 border border-[#FF6F00]" />
            <button type="button" onClick={handleDeleteImage} className="bg-red-500 text-white p-2 rounded-md">Delete Image</button>
          </div>
        )}
        <button type="submit" className="bg-[#FF6F00] text-white p-2 w-full rounded-md font-bold">
          {editingProduct ? "Update Product" : "Add Product"}
        </button>
      </form>

      <h2 className="text-2xl font-bold text-[#FF6F00] mt-8">Your Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {products.map((product) => (
          <div key={product.id} className="border border-[#FF6F00] p-4 rounded-md shadow-md">
            <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover mb-2" />
            <h3 className="text-xl font-bold text-black">{product.name}</h3>
            <p className="text-gray-700">{product.description}</p>
            <p className="font-semibold">Price: ₹{product.price}</p>
            <p className="font-semibold">Discount: ₹{product.discount}</p>
            <button onClick={() => setEditingProduct(product)} className="bg-[#FF6F00] text-white p-2 rounded-md mt-2 w-full">Edit</button>
            <button onClick={() => handleDeleteProduct(product.id)} className="bg-red-500 text-white p-2 rounded-md mt-2 w-full">Delete</button>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}

export default SellerDashboard;
