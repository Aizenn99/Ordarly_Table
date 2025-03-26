const express = require("express");
const router = express.Router();
const {
  loginUser,
  authMiddleWare,registerUser
} = require("../../controllers/auth/auth-controller");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/check-auth", authMiddleWare, (req, res) => {
  const user = req.user;
  res.status(200).json({ success: true, message: "user found", user });
});

module.exports = router;
