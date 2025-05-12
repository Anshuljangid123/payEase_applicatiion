const JWT_SECRET  = require("./config").default;
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(403).json({message : "error 403 forbidden error"});
    }

    const token = authHeader.split(' ')[1]; // sacturate the token from the authentication string 

    try {
        console.log("inside try block of the middleware")
        console.log("jwt secret : " , JWT_SECRET);
        
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log(decoded);
        req.userId = decoded.userId;

        next();
    } catch (err) {
        return res.status(403).json({message : "eroor 403 at the end of middleware "});
    }
};

module.exports = {
    authMiddleware
}