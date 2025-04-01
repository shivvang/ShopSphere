import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";

// Load the .proto file
const PROTO_PATH = path.join(__dirname, "protos", "recommendation.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const recommendationProto = grpc.loadPackageDefinition(packageDefinition).recommendation;

// Sample product data
const products = [
  { id: "1", name: "Product A", imageUrl: "url1", price: 100 },
  { id: "2", name: "Product B", imageUrl: "url2", price: 200 },
  { id: "3", name: "Product C", imageUrl: "url3", price: 300 },
];

// Implement the gRPC method
function GetRecommendations(call, callback) {
  console.log(`Received request from user ${call.request.userId}`);

  // Send some dummy recommended products
  callback(null, { products });
}

// Start the gRPC server
function startServer() {
  const server = new grpc.Server();
  server.addService(recommendationProto.RecommendationService.service, { GetRecommendations });
  
  const PORT = "50051";
  server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`✅ gRPC Server running on port ${PORT}`);
    server.start();
  });
}

startServer();
