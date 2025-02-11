const jwt = require("jsonwebtoken");
const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({ message: "Token missing or invalid." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized access." });
    }
    req.user = decoded; // Attach decoded token to the request object
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};
module.exports = verifyAdminToken;
