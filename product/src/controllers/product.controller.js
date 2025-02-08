import {Product} from "../Database/Database.js";
import { validateAddProduct, validateSearchFilters, validateUpdateProduct } from "../validators/productValidator.js";
import {ApiError} from "../utils/ApiError.js";
import log from "../utils/logHandler.js";
import { deleteUploadedFile, getSignedUploadUrl } from "../S3/s3Service.js";
import axios from "axios";
import path from "path";


// **Create a new product**
export const createProduct = async (req, res, next) => {
  log.info("Create product endpoint hit...");
  try {
    // Validate request data
    const { error } = validateAddProduct(req.body);
    if (error) {
      log.error("Validation error while adding product:", error.details);
      return next(new ApiError(400, "Invalid product data", error.details));
    }

    const { name, description, imageUrl, stock, price, discount, category, brand, ratings, tags, searchKeywords } = req.body;

    // Check if the product already exists
    const existingProduct = await Product.findOne({ name, description, category, brand });
    if (existingProduct) {
      log.info("Product already exists with the same name, description, category, and brand.");
      return next(new ApiError(409, "Product already exists."));
    }

    // Create and save the new product
    const newProduct = new Product({
      name,
      description,
      imageUrl,
      stock,
      price,
      discount,
      category,
      brand,
      ratings,
      tags,
      searchKeywords,
    });

    await newProduct.save();

    log.info("Product created successfully:", newProduct._id);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });

  } catch (error) {
    log.error("Error while adding the product:", error);
    return next(new ApiError(500, "Internal server error", error));
  }
};

// **Delete a product**
export const deleteProduct = async (req, res, next) => {
  log.info("Delete product endpoint hit...");
  try {
    const productId = req.params.productId;

    if (!productId) {
      log.error("Missing product ID in request.");
      return next(new ApiError(400, "Product ID is required."));
    }

    const productToDelete = await Product.findById(productId);
    if (!productToDelete) {
      log.warn(`Product with ID ${productId} not found.`);
      return next(new ApiError(404, "Product not found."));
    }

    if (productToDelete?.imageUrl) {
      const fileName = productToDelete.imageUrl.split("/").pop();
      await deleteUploadedFile(fileName);
    }

    await Product.findByIdAndDelete(productId);


    log.info(`Product ${productId} deleted successfully.`);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });

  } catch (error) {
    log.error("Error while deleting the product:", error);
    return next(new ApiError(500, "Internal server error", error));
  }
};

// **Search  products**
export const searchProducts = async (req, res, next) => {
  log.info("Search products endpoint hit...");
  try {
    const { error } = validateSearchFilters(req.body);

    if (error) {
      log.error("Validation error in search filters:", error.details);
      return next(new ApiError(400, "Invalid search filters", error.details));
    }

    const { searchQuery, category, brand, discount, price, rating, sortOrder } = req.body;
    const searchPage = parseInt(req.query.page) || 1;
    const pageSize = 10;
    const skipCount = (searchPage - 1) * pageSize;

    let filters = {};

    // **Primary Search (tags & searchKeywords)**
    if (searchQuery) {
      filters.$or = [
        { tags: { $in: searchQuery.split(" ") } },
        { searchKeywords: { $in: searchQuery.split(" ") } },
        { $text: { $search: searchQuery } }, // Secondary search (name & description)
      ];
    }

    // **Filtering Layer**
    if (category) filters.category = category;
    if (brand) filters.brand = brand;
    if (discount) filters.discount = { $gte: parseFloat(discount) };
    if (price) filters.price = { $lte: parseFloat(price) };
    if (rating) filters.ratings = { $gte: parseFloat(rating) };

    // **Sorting Options**
    let sortOptions = {};
    if (sortOrder === "price_asc") sortOptions.price = 1;
    if (sortOrder === "price_desc") sortOptions.price = -1;

  
    const searchResults = await Product.find(filters)
      .sort(sortOptions)
      .skip(skipCount)
      .limit(pageSize);

    log.info(`Found ${searchResults.length} products matching the criteria.`);

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      totalResults: searchResults.length,
      currentPage: searchPage,
      products: searchResults,
    });

  } catch (error) {
    log.error("Error in search products:", error);
    return next(new ApiError(500, "Internal server error", error));
  }
};


export const updateProduct = async (req, res, next) => {
  log.info("Update product endpoint hit...");

  try {
    const productId = req.params.productId;

    if (!productId) {
      log.error("Product ID is required.");
      return next(new ApiError(400, "Product ID is required."));
    }

    const { error } = validateUpdateProduct(req.body);
    if (error) {
      log.error("Validation error:", error.details);
      return next(new ApiError(400, "Validation error", error.details));
    }

    const product = await Product.findById(productId);
    if (!product) {
      log.error("Product not found.");
      return next(new ApiError(404, "Product not found."));
    }

    // Update product fields
    const { name, description, imageUrl, stock, price, discount, category, brand, ratings, tags, searchKeywords } = req.body;

    if (name) product.name = name;
    if (description) product.description = description;
    if (imageUrl) product.imageUrl = imageUrl;
    if (stock !== undefined) product.stock = stock;
    if (price !== undefined) product.price = price;
    if (discount !== undefined) product.discount = discount;
    if (category) product.category = category;
    if (brand) product.brand = brand;
    if (ratings !== undefined) product.ratings = ratings;
    if (tags) product.tags = tags;
    if (searchKeywords) product.searchKeywords = searchKeywords;

    await product.save();

    log.info("Product updated successfully.");
    return res.status(200).json({ message: "Product updated successfully.", product });
  } catch (error) {
    log.error("Error updating product:", error);
    return next(new ApiError(500, "Something went wrong while updating the product.", error));
  }
};

export const uploadFileAndGetUrl = async (req, res) => {
  log.info("File upload initiated...");

  try {
    if (!req.file) {
      log.warn("No file provided in request");
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filename = req.file.originalname;
    const fileKey = path.parse(filename).name; 
    const mimeType = req.file.mimetype; 

    log.info(`Processing file: ${filename} | MIME Type: ${mimeType}`);

  
    const uploadUrl = await getSignedUploadUrl(fileKey, mimeType);

    log.info(`Generated signed upload URL: ${uploadUrl}`);

    
    const response = await axios.put(uploadUrl, req.file.buffer, {
      headers: {
        "Content-Type": mimeType, 
        "Content-Length": req.file.size,
      },
    });

    log.info(`File uploaded successfully, S3 Response: ${response.status}`);

    // ✅ Get Signed Download URL
    const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    log.info(` download URL: ${fileUrl}`);

    return res.status(200).json({
      message: "File uploaded successfully",
      fileUrl,
    });
  } catch (error) {
    log.error("File upload error:", error);
    return res.status(500).json({ error: "File upload failed" });
  }
};
