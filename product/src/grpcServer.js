import mongoose from "mongoose";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import Product from "./database/models/Product.model.js"; // Make sure path ends with .js if using ES modules

// Load the .proto file
const packageDef = protoLoader.loadSync("./protos/recommendation.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const recommendationPackage = grpcObject.recommendation;

// gRPC handler function
async function GetRecommendations(call, callback) {
  try {
    const { productIds } = call.request;

    const objectIds = productIds.map((id) => new mongoose.Types.ObjectId(String(id)));

    const wishlistProducts = await Product.find({ _id: { $in: objectIds } });

    const allTags = wishlistProducts.flatMap((p) => p.tags);
    const categories = wishlistProducts.map((p) => p.category);
    const brands = wishlistProducts.map((p) => p.brand);

    const recommended = await Product.find({
      $or: [
        { tags: { $in: allTags } },
        { category: { $in: categories } },
        { brand: { $in: brands } },
      ],
      _id: { $nin: objectIds },
    }).limit(10);

    const formatted = recommended.map((prod) => ({
      id: prod._id.toString(),
      name: prod.name,
      imageUrl: prod.imageUrl,
      price: prod.price,
    }));

    callback(null, { products: formatted });
  } catch (err) {
    console.error("gRPC Error:", err);
    callback(err);
  }
}

// Start the gRPC server
function startServer() {
  const server = new grpc.Server();
  server.addService(recommendationPackage.RecommendationService.service, {
    GetRecommendations, 
  });

  const PORT = "50051";
  server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`✅ gRPC Server running on port ${PORT}`);
    server.start();
  });
}

startServer();
