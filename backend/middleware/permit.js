const permit = (...permittedRoles) => {
  return (req, res, next) => {
    if (permittedRoles.includes(req.user.role)) return next();
    return res.status(403).json({ message: "Unauthorized" });
  };
};

module.exports = permit;
