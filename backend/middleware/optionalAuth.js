const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const optionalAuth = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.slice(7);
    }

    if (!token) {
      token = req.cookies.jwt || req.cookies.adminToken || null;
    }

    if (!token) {
      return next(); // guest user
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) return next();

    const user = await userModel.findById(decoded.id);
    if (user) {
      req.user = user;
    }

    next();
  } catch (err) {
    // Invalid token → treat as guest
    next();
  }
};

module.exports = optionalAuth;
