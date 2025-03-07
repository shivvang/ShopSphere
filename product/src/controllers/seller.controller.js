import { ApiError } from "../utils/ApiError.js";
import Seller from "../database/models/Seller.model.js";
import log from "../utils/logHandler.js";
import { validateLogin, validateNewPassWord, validateSeller } from "../validators/sellerValidator.js";

export const registerSeller = async(req,res,next)=>{

log.info("Register Seller EndPoint....");

    try {

        const { error } = validateSeller(req.body);

        if (error) {
            log.error("Validation error while registering Seller:", error.details);
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }    

    const { phone, email, password,shopName} = req.body;

    

    const existingSeller = await Seller.findOne({$or:[{phone},{email}]});

    if (existingSeller) {
        log.warn("seller with given email or phone already exists:", { email, phone });
            return res.status(400).json({
                success: false,
                message: "Email or phone number already in use.",
         });
    }

    const newSeller = new Seller({
        phone: phone,
        email: email,
        password: password,
        shopName: shopName,
    });

    await newSeller.save();

    log.info("Seller registered successfully", { sellerId: newSeller._id });

    return res.status(201).json({
        success: true,
        message: "Seller registered successfully",
        user: {
            id: newSeller._id,
            email: newSeller.email,
        },
    });

    } catch (error) {
        log.error("Error registering the seller", error);
        return next(new ApiError(500, "Internal server error", error));
    }

};

export const loginSeller = async(req,res,next)=>{
log.info("Login customer endpoint hit...");
    try {
        const {error} = validateLogin(req.body);

        if (error) {
            log.error("Validation error while logging in user:", error.details);
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }

        const {email,password} = req.body;

        const existingSeller = await Seller.findOne({email});

        if(!existingSeller) {
            log.warn("Seller with given email doesnt not exist",{email});
            return res.status(400).json({
                success:false,
                message:"seller with given email does not exist"
            })
        }

        const isPasswordCorrect = await existingSeller.comparePassword(password);

        if(!isPasswordCorrect){
            log.warn("Wrong password entered by user",{email});
            return next(new ApiError(403,"unauthorized",null));
        }

       const accessToken = existingSeller.generateAccessToken();
       const refreshToken = existingSeller.generateRefreshToken();

        log.info("User logged in successfully", { email });

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
                message: "Seller logged in successfully",
                user: {
                    id: existingSeller._id,
                    email: existingSeller.email,
                    phone: existingSeller.phone,
                },
            });

    } catch (error) {
        log.error("Error logging in Seller", error);
        return next(new ApiError(500, "Internal server error", error));
    }
};

export const refreshToken = async(req,res,next)=>{
    log.info("Reset token API endpoint hit...");
    try {

        const sellerId = req.sellerId;

        if (!sellerId) {
            log.error("Seller ID not found in request.");
            return next(new ApiError(401, "Unauthorized request"));
        }

        const  seller = await Seller.findById(sellerId);

        
        if (!seller) {
            log.warn(`No Seller found with ID: ${sellerId}`);
            return next(new ApiError(404, "Seller not found"));
        }

        const accessToken = await seller.generateAccessToken();

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
        };
        
        log.info(`Access token reset successful for seller: ${seller.email}`);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .json({
                success: true,
                message: "Access token refreshed successfully",
            });

    } catch (error) {
        log.error("Error resetting token for seller", error);
        return next(new ApiError(500, "Internal server error"));
    }
};

export const logoutSeller = async(req,res,next)=>{
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

export const resetPassword = async(req,res,next)=>{
    log.info("Reset Password API endpoint hit...");

    try {
        const sellerId = req.sellerId;

        if (!sellerId) {
            log.error("Seller ID not found in request.");
            return next(new ApiError(401, "Unauthorized request"));
        }

        const { oldPassword, newPassword } = req.body;

        const { error } = validateNewPassWord(req.body);

        if (error) {
            log.warn("Password validation failed:", error.details);
            return next(new ApiError(400, error.details[0].message));
        }

        const seller = await Seller.findById(sellerId);

        if (!seller) {
            log.warn(`Seller not found with ID: ${sellerId}`);
            return next(new ApiError(404, "User not found."));
        }

        const isCorrect = await seller.comparePassword(oldPassword);
        if (!isCorrect) {
            log.warn("Incorrect old password provided.");
            return next(new ApiError(403, "Invalid credentials."));
        }

        seller.password = newPassword;

        await seller.save();

        log.info(`Password reset successful for seller: ${seller.email}`);

        return res.status(200).json({ success: true, message: "Password updated successfully." });

    } catch (error) {
        log.error("Error resetting password for seller:", error);
        return next(new ApiError(500, "Internal server error."));
    }
}


export const deleteSeller = async (req, res, next) => {
    log.info("Deleting Seller account...");
    try {
        const sellerId = req.sellerId;
        
        if (!sellerId) {
            log.error("Seller ID is missing.");
            return next(new ApiError("Seller ID is required", 400));
        }

       
        const seller = await Seller.findById(sellerId);

        if (!seller) {
            log.error(`Seller with ID ${sellerId} not found.`);
            return next(new ApiError("Seller not found", 404));
        }

        await Seller.deleteOne({ _id: sellerId });
        log.info(`Seller with ID ${sellerId} successfully deleted.`);

        
         res.clearCookie('accessToken');  
         res.clearCookie('refreshToken'); 

        return res.status(200).json({
            success: true,
            message: "Account deleted successfully."
        });
    } catch (error) {
        log.error("Error occurred while deleting the seller account.", error);
        return next(new ApiError("Internal Server Error", 500));
    }
};

export const associateProductWithSeller = async(req,res,next)=>{
    log.info("associateProduct end point is hit....")
    try {
        const { productId } = req.params;
        const sellerId = req.sellerId;

        if (!productId || !sellerId) {
            return next(new ApiError("Missing required parameters: sellerId or productId", 400));
        }

        const seller = await Seller.findById(sellerId);
        if (!seller) {
            return next(new ApiError("Seller not found", 404));
        }

     
        if (seller.products.includes(productId)) {
            return next(new ApiError("Product is already associated with this seller", 400));
        }

      
        seller.products.push(productId);
        await seller.save();

        log.info(`Product ${productId} successfully associated with seller ${sellerId}`);
        return res.status(200).json({ message: "Product associated successfully", seller });


    } catch (error) {
        log.error("Error occurred while associating product with seller:", error);
        return next(new ApiError("Internal Server Error", 500));
    }
}

export const disassociateProductFromSeller = async (req, res, next) => {
    log.info("dis associateProduct end point is hit....");
    try {
      const { productId } = req.params;
      const sellerId = req.sellerId;
  
      if (!productId || !sellerId) {
        return next(new ApiError("Missing required parameters: sellerId or productId", 400));
      }
  
      const seller = await Seller.findById(sellerId);
      if (!seller) {
        return next(new ApiError("Seller not found", 404));
      }
  
      if (!seller.products.includes(productId)) {
        return next(new ApiError("Product is already dis associated with this seller", 400));
      }
  
    
      seller.products = seller.products.filter((id) => id.toString() !== productId);
  
      await seller.save();
  
      log.info(`Product ${productId} successfully disassociated from seller ${sellerId}`);
      return res.status(200).json({ message: "Product disassociated successfully", seller });
    } catch (error) {
      log.error("Error occurred while dis associating product with seller:", error);
      return next(new ApiError("Internal Server Error", 500));
    }
  };

export const getSellerProducts = async (req, res, next) => {
    log.info("Fetching all products for the seller...");

    try {
        const sellerId = req.sellerId;

        if (!sellerId) {
            return next(new ApiError("Seller ID is required", 400));
        }

        const seller = await Seller.findById(sellerId).populate("products");

        if (!seller) {
            return next(new ApiError("Seller not found", 404));
        }

        if (!seller.products.length) {
            return res.status(200).json({ success:true, message: "No products found for this seller", products: [] });
        }

        return res.status(200).json({ success:true,message: "Products fetched successfully", products: seller.products });

    } catch (error) {
        log.error("Error fetching seller's products:", error);
        return next(new ApiError("Internal Server Error", 500));
    }
};