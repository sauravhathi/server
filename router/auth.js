const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("../db/conn");
const User = require("../model/userSchema");


router.get("/", (req, res) => {
  res.send("server is running...");
});

router.post("/register", async (req, res) => {
  
  const { name, email, phone, work, password } = req.body;

  if (!name || !email || !phone || !work || !password) {
    return res.status(422).json({ error: "Please fill the field properly" });
  }else if (name.length < 3 || name.length > 20) {
    return res.status(422).json({ error: "Name must be between 3 and 20 characters" });
  }else if (phone.length < 10 || phone.length > 14) {
    return res.status(422).json({ error: "Phone number must be between 10 and 14 characters" });
  }else if (password.length < 6 || password.length > 16) {
    return res.status(422).json({ error: "Password must be between 6 and 16 characters" });
  }


  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({ error: "Email already exist" });
    } else {
      const user = new User({ name, email, phone, work, password });

      await user.save();

      res.status(201).json({ message: "User registered successfully" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please fill the data" });
    }

    // search user by email
    const userLogin = await User.findOne({ email: email });

    if(userLogin){

      // checking database password with user password
      const isMatch = await bcrypt.compare(password, userLogin.password);

      // generate token
      const token = await userLogin.generateAuthToken();

      // store token in cookie
      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true
      });


      if (!isMatch) {
        res.json({ error: "Invalid credentials" });
      } else {
        res.json({ message: "User Signin successfully" });
      }
    }else{
      res.status(400).json({ error: "Invalid credentials" });
    }

  } catch (err) {
    console.log(err);
  }
});

module.exports = router;