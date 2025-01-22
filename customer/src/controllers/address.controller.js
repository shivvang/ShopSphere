import { Address, Customer } from "../database/Database.js";
import { ApiError } from "../utils/ApiError.js";
import log from "../utils/logHandler.js"
import { validateRegistrationAddress } from "../validators/addressValidator.js";

export const addAddress = async (req, res, next) => {
    log.info("Create address endpoint hit");

    try {
        const userId = req.userId;
        if (!userId) {
            log.error("User ID is missing in request");
            return next(new ApiError("Unauthorized access", 401));
        }

        const { error } = validateRegistrationAddress(req.body);
        if (error) {
            log.error(`Validation Error: ${error.details[0].message}`);
            return next(new ApiError(error.details[0].message, 400));
        }

        // Check if the same address already exists for the user
        const existingAddress = await Address.findOne({
            userId: userId,
            street: req.body.street,
            postalCode: req.body.postalCode,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
        });

        if (existingAddress) {
            log.error("Address already exists for this user");
            return next(new ApiError("Address already exists", 409));
        }

        const newAddress = new Address({
            street: req.body.street,
            postalCode: req.body.postalCode,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            userId: userId,
        });

        await newAddress.save();
        log.info("New address successfully created");

        return res.status(201).json({
            success: true,
            message: "Address created successfully",
            address: newAddress,
        });

    } catch (error) {
        log.error("Error creating address", error);
        return next(new ApiError("Internal Server Error", 500));
    }
};

export const deleteAddress = async (req, res, next) => {
    log.info("Delete address endpoint hit");

    try {
        const addressId = req.params.addressId;

        if (!addressId) {
            log.error("Address ID is missing in request");
            return next(new ApiError("Address ID is required", 400));
        }

        const findAddress = await Address.findById(addressId);

        if (!findAddress) {
            log.error(`Address not found: ${addressId}`);
            return next(new ApiError("Address not found", 404));
        }

        await Address.deleteOne({ _id: addressId });

        log.info(`Address deleted successfully: ${addressId}`);

        return res.status(200).json({
            success: true,
            message: "Address deleted successfully",
        });

    } catch (error) {
        log.error("Error deleting address", error);
        return next(new ApiError("Internal Server Error", 500));
    }
};

export const findAllAddresses = async (req, res, next) => {
    try {
        const userId = req.userId;

        if (!userId) {
            log.error("User ID is missing in request");
            return next(new ApiError("User ID is required", 400));
        }

        const addresses = await Address.find({ userId });

        if (!addresses || addresses.length === 0) {
            log.error(`No addresses found for user: ${userId}`);
            return next(new ApiError("No addresses found", 404));
        }

        log.info(`Fetched ${addresses.length} addresses for user: ${userId}`);

        return res.status(200).json({
            success: true,
            addresses,
        });

    } catch (error) {
        log.error("Error fetching addresses", error);
        return next(new ApiError("Internal Server Error", 500));
    }
};

export const setDefaultAddress = async (req, res, next) => {
    try {
        const addressId = req.params.addressId;
        const userId = req.userId;

        if (!addressId || !userId) {
            log.error("Address ID or User ID is missing");
            return next(new ApiError("Address ID and User ID are required", 400));
        }

        // Find the address by ID
        const address = await Address.findById(addressId).select("-userId -__v");

        if (!address) {
            log.error(`Address not found: ${addressId}`);
            return next(new ApiError("Address not found", 404));
        }

        // Find the customer by user ID
        const customer = await Customer.findById(userId);

        if (!customer) {
            log.error(`Customer not found: ${userId}`);
            return next(new ApiError("Customer not found", 404));
        }

        // Store the full address object inside the Customer model
        customer.address = address.toObject(); // Convert Mongoose document to plain object
        await customer.save();

        log.info(`Default address set for user: ${userId}`);

        return res.status(200).json({
            success: true,
            message: "Default address updated successfully",
            address: customer.address,
        });

    } catch (error) {
        log.error("Error setting default address", error);
        return next(new ApiError("Internal Server Error", 500));
    }
};


export const removeDefaultAddress = async (req, res, next) => {
    try {
        const addressId = req.params.addressId;
        const userId = req.userId;

        if (!addressId || !userId) {
            log.error("Address ID or User ID is missing");
            return next(new ApiError("Address ID and User ID are required", 400));
        }

        // Find the customer by user ID
        const customer = await Customer.findById(userId);

        if (!customer) {
            log.error(`Customer not found: ${userId}`);
            return next(new ApiError("Customer not found", 404));
        }

        //Check if the customer has a default address 
        if (!customer.address || customer.address._id !== addressId) {
            log.error(`No matching address found for user: ${userId}`);
            return next(new ApiError("Address not found or already removed", 400));
        }

        // Clear the default address by setting it to an empty object
        customer.address = {}; // Reset to empty object,

        await customer.save();

        log.info(`Default address removed for user: ${userId}`);

        return res.status(200).json({
            success: true,
            message: "Default address removed successfully",
        });

    } catch (error) {
        log.error("Error removing default address", error);
        return next(new ApiError("Internal Server Error", 500));
    }
};
