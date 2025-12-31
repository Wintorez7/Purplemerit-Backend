const isNormalUser = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(403).json({
      success: false,
      message: "Access Denied! Only normal users can access this route",
    });
  }
  next();
};

module.exports = isNormalUser;
