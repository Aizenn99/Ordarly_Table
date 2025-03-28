const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");

//Register User Controller

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser)
      return res.json({
        success: false,
        message: "User Already exists with the same email! Please try again",
      });

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashPassword,
    });

    await newUser.save();
    res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

//Login User Controller
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, checkUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      {
        userId: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.username,
      },
      process.env.JWT_SECRET ||
        "3ace777bd66b16bd9a36ab667e3b7b12d70f6b146ff375c67e210f820e373f3d",
      { expiresIn: "1d" }
    );

    res.cookie("token", token, { httpOnly: true, secure: true }).json({
      success: true,
      message: "login successfully",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.username,
        token: token,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//auth middleware

const authMiddleWare = async (req, res, next) => { // ✅ Add `next` as a parameter
  try {
    const token = req.cookies?.token; // ✅ Use optional chaining to avoid errors

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ✅ Store decoded user in `req.user`

    next(); // ✅ Call next() to pass control to the next middleware or route handler
  } catch (error) {
    console.error("Auth Error:", error);
    return res.status(403).json({ success: false, message: "Unauthorized: Invalid token" });
  }
};


module.exports = { loginUser, authMiddleWare, registerUser };
