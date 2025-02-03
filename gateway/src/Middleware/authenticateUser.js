import jwt from 'jsonwebtoken';
import log from '../utils/logHandler.js';

// Middleware function to validate token
const validatetoken = async (req, res, next) => {
  
  const token = req.cookies?.accessToken; 

  log.info("Validating user at api gateway before hitting sensitive endpoints");

  if (!token) {
    log.warn("User doesn't have an access token.");
    return res.status(401).json({
      success: false,
      message: "You are not authorized"
    });
  }

  try {
    // Validate Access Token using JWT Secret
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    // If valid, attach user info to the request and move to the next middleware
    req.user = decoded;

    
    log.info(`User validated successfully. User ID: ${decoded.userId}`);

    next();

  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      log.warn("Access token has expired");
    } else if (error instanceof jwt.JsonWebTokenError) {
      log.warn("Invalid access token");
    } else {
      log.error("Unexpected error occurred while verifying token:", error);
    }
    
    // Respond with a generic error message
    res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

export default validatetoken;