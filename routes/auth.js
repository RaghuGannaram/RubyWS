const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');


router.post("/register", async (req, res) => {
    try { 
        const salt = await bcrypt.genSalt(5);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({username: req.body.username, email: req.body.email, password: hashedPassword, handle:req.body.handle})

        const user = await newUser.save();
        res.status(200).json(user);

    } catch (err) {
        res.status(500).json(err);
    }
})

router.post("/login", async (req, res) => {
    try { 
        const user = await User.findOne({email: req.body.email});
        if(!user) return res.status(404).send("User not found");

        const password = user.password;
        const isValidPass = await bcrypt.compare(req.body.password, password);
        if(!isValidPass) return res.status(400).send("Wrong Password");

        res.status(200).json(user);

    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;
