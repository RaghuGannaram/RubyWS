const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');


router.post("/register", async (req, res) => {
    try { // Hashed the password
        const salt = await bcrypt.genSalt(5);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Created the user
        const newUser = new User({username: req.body.username, email: req.body.email, password: hashedPassword})

        // Saved the user to database and send json response
        const user = await newUser.save();
        res.status(200).json(user);

    } catch (err) {
        res.status(500).json("Internal server error");
    }
})

router.post("/login", async (req, res) => {
    try { // Query the DB for user email
        const user = await User.findOne({email: req.body.email});
        ! user && res.status(404).json("User not found");

        // Validate the password
        const password = user.password;
        const isValidPass = await bcrypt.compare(req.body.password, password);
        ! isValidPass && res.status(400).json("Wrong Password")

        // Send the JSON response
        res.status(200).json(user);

    } catch (err) {
        res.status(500).json("Internal server error");
    }
})

module.exports = router;
