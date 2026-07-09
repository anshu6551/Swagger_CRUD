const jwt = require('jsonwebtoken');
const httpStatusCode = require('../utils/httpStatusCode');

const authCheck = (req, res, next) => {
    
    let token = req?.body?.token || req?.query?.token || req?.headers?.["x-access-token"] || req?.headers?.["authorization"];

    if (!token) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
            success: false,
            message: "Not Authorized: Token missing"
        });
    }

   
    if (token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
    }

    try {
        
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decode;
        next();
    }
    catch (err) {
        
        return res.status(httpStatusCode.FORBIDDEN || 403).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
}

module.exports = authCheck;