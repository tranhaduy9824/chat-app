const userModel = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  const jwtKey = process.env.JWT_SECRET_KEY;

  return jwt.sign({ _id }, jwtKey, { expiresIn: "3d" });
};

const registerUser = async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    let user = await userModel.findOne({ email });

    if (user)
      return res.status(400).json("User with the given email already exist...");

    if (!fullname || !email || !password)
      return res.status(400).json("All fields are required...");

    if (!validator.isEmail(email))
      return res.status(400).json("Email must be a valid email...");

    if (!validator.isStrongPassword(password))
      return res.status(400).json("Password must be a strong password...");

    user = new userModel({ fullname, email, password });

    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(user.password, salt);

    await user.save();

    const token = createToken(user._id);

    return res.status(200).json({ _id: user._id, fullname, email, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await userModel.findOne({ email });

    if (!user) return res.status(400).json("Invalid email or password");

    const isValidPassword = await bcryptjs.compare(password, user.password);

    if (!isValidPassword) return res.status(400).json("Invalid email or password");

    const token = createToken(user._id);

    return res.status(200).json({ _id: user._id, fullname: user.fullname, email, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const findUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await userModel.findById(userId)

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const getUsers = async (req, res) => {
    try {
      const users = await userModel.find()
  
      return res.status(200).json(users);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  };

module.exports = { registerUser, loginUser, findUser, getUsers };
