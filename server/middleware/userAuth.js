import jwt from "jsonwebtoken";

export const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }

  try {
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    if (decodeToken.id) {
      req.user = decodeToken;
      next();
    } else {
      res.json({ success: false, message: "Invalid Token" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
