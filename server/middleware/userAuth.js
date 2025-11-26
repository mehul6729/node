import jwt from "jsonwebtoken";

export const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.json({ success: false, message: "no token" });
  }

  try {
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decode Token", decodeToken);
    if (decodeToken.id) {
      req.userId = decodeToken.id;
      console.log("Decode Token.id stored in req.userId");
    } else {
      res.json({ success: false, message: "Invalid Token" });
    }

    next();
  } catch (error) {
    console.log(error.message, "user Auth");
    res.json({ success: false, message: error.message });
  }
};
