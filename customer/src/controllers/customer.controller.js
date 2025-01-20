import {Customer} from "../database/Database.js";
import { ApiError } from "../utils/ApiError.js";
import log from "../utils/logHandler.js"

export const createCustomer = async (req, res, next) => {
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

        const { email, password, phone } = req.body;

        // Check if email or phone already exists
        const existingCustomer = await Customer.findOne({ $or: [{ email }, { phone }] });

        if (existingCustomer) {
            log.warn("User with given email or phone already exists:", { email, phone });
            return res.status(400).json({
                success: false,
                message: "Email or phone number already in use.",
            });
        }

        // Create new customer
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
