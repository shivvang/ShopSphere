# 🛍️ Shop Sphere

**Shop Sphere** is a full-fledged **microservices-based e-commerce platform** designed with scalability, modularity, and high performance in mind. The system is composed of independent services that communicate with each other using **RabbitMQ** for asynchronous messaging and **gRPC** for high-performance communication between customer and product services.

---

## 🧩 Microservices Architecture

Shop Sphere consists of the following services:

### 1. 👤 Customer Service
- Handles:
  - Customer authentication
  - User cart & wishlist
  - Order history
  - Unread notification storage (notifications have a **TTL of 1 day**, after which they are deleted)
- **gRPC Client** to Product Service for:
  - Getting recommended products based on wishlist
  - Recommendations based on previous orders

### 2. 📦 Product Service
- Handles:
  - Seller authentication
  - Product creation, update, deletion, and retrieval
- **gRPC Server**:
  - Accepts wishlist and past orders from Customer Service
  - Returns personalized product recommendations
- Advanced search using **MongoDB Aggregation Pipeline**
- Image uploads to **AWS S3**

### 3. 🛒 Shopping Service
- Handles:
  - Add to cart / Remove from cart
  - Clear cart
  - Order single/multiple products
  - Cancel orders
  - Add to wishlist / Remove from wishlist
- Includes:
  - **BullMQ** for scheduled jobs (e.g., simulated delivery)
  - **WebSocket (Socket.io)** to notify delivery progress in real-time

### 4. 🌐 API Gateway
- Acts as a **reverse proxy**, routing requests to appropriate services
- Implements **rate limiting** to mitigate DDoS attacks

---

## 🛠️ Tech Stack

### 🔧 Backend
- **Node.js**, **Express.js**
- **MongoDB**, **Redis**
- **RabbitMQ**, **BullMQ**
- **gRPC**, **Socket.io**
- **AWS SDK** (S3)

### 🎨 Frontend
- **React**, **Tailwind CSS**
- **Redux**
- **Socket.io Client**

### 💡 Frontend Optimizations
- DRY Principles
- Code splitting
- Lazy image loading
- Memoization
- Debounced search
- Pagination

---

## ⚙️ Environment Variables

### Customer Service
You need to set the following environment variables for the **Customer Service**:

```env

MONGO_DB_URI=  # MongoDB connection string
ACCESS_TOKEN_SECRET=  # Secret for verifying access tokens
REFRESH_TOKEN_SECRET=  # Secret for verifying refresh tokens
ACCESS_TOKEN_EXPIRY=  # Expiry time for access token
REFRESH_TOKEN_EXPIRY=  # Expiry time for refresh token
PORT=  # Port for the customer service
RABBITMQ_URL=  # RabbitMQ connection URL
FRONTEND_URL=  # Frontend URL (for redirection and notifications)
RECOMMENDATION_GRPC_ENDPOINT= # Recommendation service gRPC endpoint

### Product Service
You need to set the following environment variables for the **Product Service**:

```env

MONGO_DB_URI=  # MongoDB connection string
ACCESS_TOKEN_SECRET=  # Secret for verifying access tokens
SELLER_ACCESS_TOKEN_SECRET=  # Seller authentication token secret
SELLER_ACCESS_TOKEN_EXPIRY=  # Expiry time for seller access tokens
SELLER_REFRESH_TOKEN_SECRET=  # Seller refresh token secret
SELLER_REFRESH_TOKEN_EXPIRY=  # Expiry time for seller refresh tokens
PORT=  # Port for the product service
RABBITMQ_URL=  # RabbitMQ connection URL
AWS_S3_BUCKET_NAME=  # AWS S3 bucket name
AWS_S3_CLIENT_ACCESS_KEY=  # AWS S3 client access key
AWS_S3_CLIENT_SECRET_KEY=  # AWS S3 client secret key
AWS_REGION=  # AWS region for S3

### Shopping Service
You need to set the following environment variables for the **Shopping Service**:

```env

MONGO_DB_URI=  # MongoDB connection string
PORT=  # Port for the shopping service
ACCESS_TOKEN_SECRET=  # Secret for verifying access tokens
REDIS_HOST=  # Redis host for caching
REDIS_PORT=  # Redis port for caching
REDIS_PASSWORD=  # Redis password for authentication
RABBITMQ_URL=  # RabbitMQ connection URL
SOCKET_PORT=  # Port for the WebSocket server
FRONTEND_URL=  # Frontend URL (for notifications and redirection)

### Gateway Service
You need to set the following environment variables for the **Gateway Service**:

```env

REDIS_URL=  # Redis URL for caching
CUSTOMER_SERVICE_URL=  # URL for accessing the customer service
PRODUCT_SERVICE_URL=  # URL for accessing the product service
SHOPPING_SERVICE_URL=  # URL for accessing the shopping service
PORT=  # Port for the API Gateway
FRONTEND_URL=  # Frontend URL (for routing requests)



## 🧪 Installation & Setup

### 📦 Prerequisites

Ensure the following tools/services are installed and configured:

* [Redis Installation Guide](https://redis.io/downloads/)
* [RabbitMQ Installation Guide](https://www.rabbitmq.com/docs/install-windows)
* [AWS S3 Bucket Setup Guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/GetStartedWithS3.html) (with appropriate credentials configured)


## 🚀 Running the Project

### 1. Install Dependencies for Each Microservicecd Customer && npm install

 * cd Customer && npm install
 * cd Product && npm install
 * cd Shopping && npm install
 * cd gateway && npm install

### 2. Set Up Environment Variables

* Create a .env file in each service directory (Customer, Product, Shopping, gateway). Add the necessary environment variables as described in the Setup section of this README.

### 3. Start Redis & RabbitMQ Servers⚠️ 

 * Use WSL (Ubuntu) or Docker, depending on your environment.  Ensure these services are running before proceeding.
 
### 4. Start Each Backend Service
 * # Run the following command in each service directory (Customer, Product, Shopping, gateway):
 * npm run start

### 5. Start the Frontend

* cd frontend
* npm install
* npm run dev

### 6. Start gRPC Server (Product Service)

* First, ensure the following script is present in the package.json file within the src/Product directory:

* "scripts": {
  // ... other scripts
  "start:grpc": "node src/grpcServer.js",
  // ...
}

* Then, run the server:cd src/Product

* npm run start:grpc

### 7. Start BullMQ Worker (Shopping Service)

* Similarly, confirm this script exists in the package.json file inside the src/Shopping directory:

* "scripts": {
  // ... other scripts
  "start:bullmq": "nodemon src/Queue/worker.js",
  // ...
}

* After verifying the script, start the worker:cd src/Shopping

* npm run start:bullmq


## 📌 Project Highlights

* ✅ Modular Microservice Architecture – Each core feature is separated into independent, scalable services.

* 📡 gRPC Communication – Enables fast and type-safe inter-service messaging.

* 📨 RabbitMQ Integration – Powers decoupled, scalable communication across services.

* 📷 AWS S3 Storage – Used for secure and efficient image uploads.

* ⚡ Real-time Updates – Achieved using Socket.io for order status and notifications.

* 🛡️ API Gateway – Centralized entry point with rate-limiting for security and traffic control.

* ⏱️ Scheduled Jobs with BullMQ – Used to mimic real-world behavior of delayed order arrivals (e.g., simulating order status progression like "Packed → Shipped → Delivered").

## 📚 Future Enhancements

* 🧮 Admin dashboard for sellers & platform analytics

* 🔍 Smarter recommendation engine using ML algorithms

* 💳 Additional payment gateways (e.g., Stripe, Razorpay)

* 🚀 CI/CD pipeline with Docker + Kubernetes

## 🤝 Contributing

- Contributions are welcome!

- Please feel free to open issues and submit pull requests. For major changes, it's best to open a discussion first to ensure alignment.



Happy coding! 🚀