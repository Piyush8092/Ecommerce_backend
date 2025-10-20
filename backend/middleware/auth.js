const jwt=require('jsonwebtoken');
 let userModel = require('../models/userModel');
 
const authGuard= async(req,res,next)=>{
    try{
        // Try to get token from multiple sources
        let token = null;

        // 1. Check Authorization header first (Bearer token)
        if (req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.slice(7); // Remove 'Bearer ' prefix
            }
        }

        // 2. If not in header, check cookies
        if (!token) {
            token = req.cookies.jwt || req.cookies.adminToken;
        }

        if(!token){
            return res.status(401).json({message:'Unauthorized - No token provided'});
        }

        // Verify JWT token
        const decoded = jwt.verify(
            token,
            process.env.SECRET_KEY || 'me333enneffiimsqoqomcngfehdj3idss'
        );

        if (!decoded || !decoded.id) {
            return res.status(401).json({ message: 'Unauthorized - Invalid Token' });
        }

        // ✅ Find user
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized - User Not Found' });
        }

        // ✅ Attach user to request
        req.user = user;
        next();
    }
    catch(e){
        console.error('Auth error:', e.message);
        res.status(401).json({message:'Unauthorized - ' + e.message});
    }
}
module.exports=authGuard;
