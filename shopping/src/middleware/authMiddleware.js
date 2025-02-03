import log from "../utils/logHandler.js";

const authenticatedRequest = (req,res,next)=>{

    log.info("validating user before hitting the problem routes");

    const  userId = req.headers["x-user-id"];
    
    if(!userId){

        log.warn("Access to problem  end point without user id");
        
        return res.status(401).json({
            succes:false,
            message:"Authentication required Please Login to Continue",
        });
    }

    req.user = userId; 

    log.info("User authenticated for Shopping routes");

    next();
}

export default authenticatedRequest;