const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const handleError = require("../utils/handleError");

const createToken = (user) =>
  jwt.sign({ id: user._id, userType: user.userType }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        msg: "Name, email, password and phone are required",
        status: false,
      });
    }

    const pass = String(password);
    if (pass.length < 6) {
      return res.status(400).json({
        msg: "Password must be at least 6 characters",
        status: false,
      });
    }

    const existing = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ msg: "Email already registered", status: false });
    }

    const hashedPassword = await bcrypt.hash(pass, 10);

    // userType is always "user" here. Admins must be promoted directly in the database.
    await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      userType: "user",
    });

    return res.status(201).json({ msg: "User registered successfully", status: true });
  } catch (error) {
    return handleError(res, error);
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required", status: false });
    }

    const user = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ msg: "Invalid email or password", status: false });
    }

    const isMatch = await bcrypt.compare(String(password), user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid email or password", status: false });
    }

    const token = createToken(user);

    return res.status(200).json({
      msg: "Login successful",
      status: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
      },
    });
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = { register, login };
