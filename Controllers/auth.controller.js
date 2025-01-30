const { PutObjectCommand } = require("@aws-sdk/client-s3");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { S3, randomImageName, Bucket_name } = require("../util/awsClient");
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter both email and password Correctly" });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "User not found" });
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res.status(401).json({ message: "Invalid password" });
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        username: user.username,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "3h",
      }
    );
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.log(err);
    next();
  }
};
exports.register = async (req, res, next) => {
  try {
    const profileImage = req.file;
    if (!profileImage) {
      return res.status(400).json({ message: "Please upload a profile image" });
    }
    const { username, email, password } = req.body;

    if (username && email && password) {
      const user = await User.findOne({ email: email });
      if (user)
        return res.status(400).json({ message: "Email already exists" });
      const hashedPassword = await bcrypt.hash(password, 10);
      const imageName = randomImageName();
      const params = {
        Bucket: Bucket_name,
        Key: `ProfileImages/${imageName}`,
        Body: profileImage.buffer,
        ContentType: profileImage.mimetype,
      };
      const command = new PutObjectCommand(params);

      await S3.send(command);
      console.log("image uploaded");
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        imageName: imageName,
      });
      const savedUser = await newUser.save();
      res.status(200).json({ message: "User created successfully" });
    }
  } catch (err) {
    console.log(err);
    next();
  }
};
