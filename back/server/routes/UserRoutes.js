const User = require("../models/User");
const { Router } = require("express");
const router = Router();    
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../middlewares/verifyToken");
const localIpAddress = require("local-ip-address");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const Token = require("../models/Token");
const sendEmail = require("../utils/sendMail");
const crypto = require("crypto");

// Get all users
router.get("/users", verifyToken,async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.log(err);
    }
    }
);

// Get one user
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (err) {
        console.log(err);
    }
    }
);


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../front/src/utils/profilePictures");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
  ];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let upload = multer({ storage, fileFilter });
// Register
router.post("/", upload.single("image"), async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const takenUsername = await User.findOne({ username: req.body.username });
        const takenEmail = await User.findOne({ email: req.body.email });
        const ip = localIpAddress();
        const approved = false;
        if (takenUsername || takenEmail) {
            res.status(400).send("Username or email already taken");
          } else {
        const user = new User({
            _id: req.body._id,
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            image: req.file.filename,
            phonenumber: req.body.phonenumber,
            password: hashedPassword,
            role: req.body.role,
            place: req.body.place,
            approved: approved,
            ip: ip,
        });
        await user.save();
        res.json(user);
    }
    } catch (err) {
        console.log(err);
    }
    }
    
);

// Update user
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        user.username = req.body.username;
        user.firstname = req.body.firstname;
        user.lastname = req.body.lastname;
        user.email = req.body.email;
        user.image = req.body.image;
        user.phonenumber = req.body.phonenumber;
        user.password = req.body.password;
        user.role = req.body.role;
        user.place = req.body.place;
        user.approved = req.body.approved;
        user.ip = req.body.ip;
        await user.save();
        res.json(user);
    } catch (err) {
        console.log(err);
    }
    }
);

// Delete user
router.delete("/:id", verifyToken, async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      await User.findByIdAndDelete(req.params.id);
      res.json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Approve user
  router.put("/approve/:id", verifyToken, async (req, res) => {
    try {
        User.findOne({ _id: req.params.id }).then((user) => {
            user.approved = true;
            user.save();
            res.status(200).send("User approved");
          });
    } catch (err) {
        console.log(err);
    }
    }
);
  

// Login
router.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Find the user by username
      const user = await User.findOne({ username });
      const ip = localIpAddress();
  
      // Check if the user exists
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      } else if (!user.approved) {
        return res.status(401).json({ message: "User not approved , please wait for an admin to approve your account" });
        } 
  
      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password).then((isCorrect) => {
        if (isCorrect) {
          const payload = {
            id: user._id,
            username: user.username,
          };
          jwt.sign(
            payload,
            process.env.JWT_SECRET,
            (err, token) => {
              if (err) {
                res.status(500).send("Error signing token");
              }
              res
                .status(200)
                .send({
                  token:token,
                  user: JSON.stringify(user),
                });
            }
          );
        } else {
          res.status(400).send("Invalid Username or Password");
        }
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  });


  router.post("/forgotPassword", async (req, res) => {
    try {
      console.log(req.body);
      const user = await User.findOne({ email: req.body.email });
      if (!user)
        return res.status(400).send("user with given email doesn't exist");
  
      let token = await Token.findOne({ userId: user._id });
      if (!token) {
        token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
      }
  
      const link = `http://localhost:3001/page-new-password?id=${user._id}&token=${token.token}`;
      await sendEmail(user.email, "Password reset", link);
  
      res.send("password reset link sent to your email account");
    } catch (error) {
      res.send("An error occured");
      console.log(error);
    }
  });
  
  router.post("/resetPassword/:userId/:token", async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) return res.status(400).send("invalid link or expired");
  
      const token = await Token.findOne({
        userId: user._id,
        token: req.params.token,
      });
      if (!token) return res.status(400).send("Invalid link or expired");
  
      user.password = await bcrypt.hash(req.body.password, 10);
      await user.save();
      await token.deleteOne();
  
      res.send("password reset sucessfully.");
    } catch (error) {
      res.send("An error occured");
      console.log(error);
    }
  });
            
module.exports = router;
  