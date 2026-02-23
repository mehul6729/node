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
    console.log("Decode Token", decodeToken);
    if (decodeToken.id) {
      // req.userId = decodeToken.id;
      req.user = decodeToken;
      console.log("Decode Token stored in req.user");
      next();
    } else {
      res.json({ success: false, message: "Invalid Token" });
    }
  } catch (error) {
    console.log(error.message, "user Auth");
    res.json({ success: false, message: error.message });
  }
};
