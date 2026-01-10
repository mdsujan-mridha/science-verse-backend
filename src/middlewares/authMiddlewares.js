const admin = require("../config/firebase");
const User = require("../models/UserModel");

const authMiddleware = async (req, res, next) => {
  // console.log(req);
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);

    let user = await User.findOne({ firebaseUID: decodedToken.uid });

    // Auto-create user if not exists
    if (!user) {
      user = await User.create({
        firebaseUID: decodedToken.uid,
        name: decodedToken.name || "Student",
        email: decodedToken.email,
        photoURL: decodedToken.picture,
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "User is blocked" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
