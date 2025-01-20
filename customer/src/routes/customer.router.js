import express from "express";

const customerRouter = express.Router();

customerRouter.post("/register", createCustomer);   // Create account  
customerRouter.put("/update", updateCustomer);      // Update customer info  
customerRouter.delete("/delete", deleteCustomer);   // Delete customer account  
customerRouter.post("/reset-password", resetPassword); // Reset password  


export default customerRouter;