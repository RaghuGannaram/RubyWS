const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");

router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(5);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const profile = fs.readFileSync(
      path.join(__dirname, "../uploads", "profile.png")
    );
    const background = fs.readFileSync(
      path.join(__dirname, "../uploads", "background.jpg")
    );
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      handle: req.body.handle,
      profilePicture: profile,
      backgroundImage: background,
    });

    const user = await newUser.save();
    const { adminStatus, password, updatedAt, __v, ...remainingData } = user._doc;
    remainingData.profilePicture = remainingData.profilePicture.toString("base64");
    remainingData.backgroundImage = remainingData.backgroundImage.toString("base64");
    
    res.status(200).json(remainingData);
  } catch (err) {
    if(err.name==="MongoError"){
      Object.keys(err.keyValue)
    }
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send("User not found");

    const userPassword = user.password;
    const isValidPass = await bcrypt.compare(req.body.password, userPassword);
    if (!isValidPass) return res.status(400).send("Wrong Password");
    const { adminStatus, password, updatedAt, __v, ...remainingData } = user._doc;
    remainingData.profilePicture = remainingData.profilePicture.toString("base64");
    remainingData.backgroundImage = remainingData.backgroundImage.toString("base64");
    res.status(200).json(remainingData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
