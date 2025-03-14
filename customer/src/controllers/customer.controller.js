import {Customer} from "../database/Database.js";
import { ApiError } from "../utils/ApiError.js";
import log from "../utils/logHandler.js"
import { validateLogin, validateNewPassWord, validateRegistration } from "../validators/customerValidator.js";

export const customerRegister = async (req, res, next) => {
    log.info("Register customer endpoint hit...");
  
    try {
        const { error } = validateRegistration(req.body);
        if (error) {
            log.error("Validation error while registering user:", error.details);
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }

        const { phone, email, password} = req.body;

     
        const existingCustomer = await Customer.findOne({ $or: [{ email }, { phone }] });

        if (existingCustomer) {
            log.warn("User with given email or phone already exists:", { email, phone });
            return res.status(400).json({
                success: false,
                message: "Email or phone number already in use.",
            });
        }

   
        const newCustomer = new Customer({
            email,
            password,  
            phone,
        });

        await newCustomer.save();

        log.info("User registered successfully", { userId: newCustomer._id });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: newCustomer._id,
                email: newCustomer.email,
            },
        });
    } catch (error) {
        log.error("Error registering the user", error);
        return next(new ApiError(500, "Internal server error", error));
    }
};


export const customerLogin = async (req, res, next) => {
    log.info("Login customer endpoint hit...");

    try {
        const { error } = validateLogin(req.body);
        if (error) {
            log.error("Validation error while logging in user:", error.details);
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }

        const { email, password } = req.body;

        // Check if customer exists
        const existingCustomer = await Customer.findOne({ email });
        if (!existingCustomer) {
            log.warn("User with given email does not exist", { email });
            return res.status(400).json({
                success: false,
                message: "Register first before logging in.",
            });
        }

        // Check password
        const isPasswordCorrect = await existingCustomer.comparePassword(password);
        if (!isPasswordCorrect) {
            log.warn("Wrong password entered by user", { email });
            return next(new ApiError(403, "Unauthorized", null));
        }

        // Generate tokens
        const accessToken = await existingCustomer.generateAccessToken();
        const refreshToken = await existingCustomer.generateRefreshToken();

        log.info("User logged in successfully", { email });

        // Set secure cookies
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, {...options,maxAge: 2 * 60 * 60 * 1000})
            .cookie("refreshToken", refreshToken, {...options,maxAge: 7 * 24 * 60 * 60 * 1000 })
            .json({
                success: true,
                message: "User logged in successfully",
                user: {
                    id: existingCustomer._id,
                    email: existingCustomer.email,
                    phone: existingCustomer.phone,
                },
            });

    } catch (error) {
        log.error("Error logging in user", error);
        return next(new ApiError(500, "Internal server error", error));
    }
};

export const resetToken = async (req, res, next) => {
    log.info("Reset token API endpoint hit...");

    try {
        const userId = req.userId;

        if (!userId) {
            log.error("User ID not found in request.");
            return next(new ApiError(401, "Unauthorized request"));
        }

        const user = await Customer.findById(userId);

        if (!user) {
            log.warn(`No user found with ID: ${userId}`);
            return next(new ApiError(404, "User not found"));
        }

        const accessToken = await user.generateAccessToken();

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
        };

        log.info(`Access token reset successful for user: ${user.email}`);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .json({
                success: true,
                message: "Access token refreshed successfully",
            });

    } catch (error) {
        log.error("Error resetting token for user", error);
        return next(new ApiError(500, "Internal server error"));
    }
};


export const resetPassword = async (req, res, next) => {
    log.info("Reset Password API endpoint hit...");

    try {
        const userId = req.userId;

        if (!userId) {
            log.error("User ID not found in request.");
            return next(new ApiError(401, "Unauthorized request"));
        }

        const { oldPassword, newPassword } = req.body;

        const { error } = validateNewPassWord(req.body);

        if (error) {
            log.warn("Password validation failed:", error.details);
            return next(new ApiError(400, error.details[0].message));
        }

        const user = await Customer.findById(userId);

        if (!user) {
            log.warn(`User not found with ID: ${userId}`);
            return next(new ApiError(404, "User not found."));
        }

        const isCorrect = await user.comparePassword(oldPassword);
        if (!isCorrect) {
            log.warn("Incorrect old password provided.");
            return next(new ApiError(403, "Invalid credentials."));
        }

        user.password = newPassword;

        await user.save();

        log.info(`Password reset successful for user: ${user.email}`);

        return res.status(200).json({ success: true, message: "Password updated successfully." });

    } catch (error) {
        log.error("Error resetting password for user:", error);
        return next(new ApiError(500, "Internal server error."));
    }
};


export const customerLogout = async (req, res, next) => {
    log.info("Logout endpoint hit");

    try {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        log.info("User logged out successfully");

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });

    } catch (error) {
        log.error("Error during logout", error);
        return next(new ApiError(500, "Internal server error"));
    }
};


export const deleteCustomer = async (req, res, next) => {
    log.info("Deleting user account...");
    try {
        const userId = req.userId;

        
        if (!userId) {
            log.error("User ID is missing.");
            return next(new ApiError("User ID is required", 400));
        }

       
        const customer = await Customer.findById(userId);
        if (!customer) {
            log.error(`Customer with ID ${userId} not found.`);
            return next(new ApiError("Customer not found", 404));
        }

        await publishEventToExchange("user.delete",{userId});

       
        await Customer.deleteOne({ _id: userId });
        log.info(`Customer with ID ${userId} successfully deleted.`);

        
         res.clearCookie('accessToken');  
         res.clearCookie('refreshToken'); 

        return res.status(200).json({
            success: true,
            message: "Account deleted successfully."
        });
    } catch (error) {
        log.error("Error occurred while deleting the user account.", error);
        return next(new ApiError("Internal Server Error", 500));
    }
};


export const customerWishlist = async(req,res,next)=>{
    log.info("Fetching customer wishlist...");

    try {
        const  userId  = req.user.userId; 

       
        const customer = await Customer.findById(userId).select("wishlist");

        // Check if user exists
        if (!customer) {
            log.warn("Customer not found!");
            return res.status(404).json({ message: "Customer not found" ,success: false});
        }

        // Send wishlist or empty array
        res.status(200).json({
            success : true,
            wishlist: customer.wishlist || []
        });

    } catch (error) {
        log.error("Error fetching wishlist:", error);
        return next(new ApiError("Internal Server Error", 500));
    }
}

export const customerCart = async(req,res,next)=>{
    log.info("Fetching customer cart...");

    try {
        const  userId  = req.user.userId; 

       
        const customer = await Customer.findById(userId).select("cart");

        // Check if user exists
        if (!customer) {
            log.warn("Customer not found!");
            return res.status(404).json({ message: "Customer not found",success: false });
        }

        // Send wishlist or empty array
        res.status(200).json({
            success : true,
            cart: customer.cart || []
        });

    } catch (error) {
        log.error("Error fetching cart:", error);
        return next(new ApiError("Internal Server Error", 500));
    }
}

export const customerOrders = async(req,res,next)=>{
    log.info("Fetching customer Orders...");

    try {
        const  userId  = req.user.userId; 

       
        const customer = await Customer.findById(userId).select("orders");

        // Check if user exists
        if (!customer) {
            log.warn("Customer not found!");
            return res.status(404).json({ message: "Customer not found" ,success: false});
        }

        // Send wishlist or empty array
        res.status(200).json({
            success : true,
            orders: customer.orders || []
        });

    } catch (error) {
        log.error("Error fetching orders:", error);
        return next(new ApiError("Internal Server Error", 500));
    }
}