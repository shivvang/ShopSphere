import log from "./logHandler.js";

const errorHandler = (err, req, res, next) => {
    log.error("API Error:", err.message);

    res.status(err.statuscode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: err.errors || [],
    });
}

export default errorHandler;