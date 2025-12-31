const isAdminUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not Authorized. Please login again.",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access Denied! Admin Only Route"
    });
  }

  next();
};

module.exports = isAdminUser;
