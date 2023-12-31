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
const { spawn } = require('child_process');



// Get all users
router.get("/users", verifyToken, async (req, res) => {
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
    cb(null, req.body._id + "-" + req.body._id + path.extname(file.originalname));
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
        address: req.body.address,
        approved: approved,
        ip: ip,
      });
      console.log(req.file)
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
    user.address = req.body.address;
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
      return res.status(401).json({ message: "User not approved, please wait for an admin to approve your account" });
    }

    // Call the face recognition script
    const pythonProcess = spawn(process.env.PYTHON_PATH, ['server/server.py']);
    const timeout = setTimeout(() => {
      pythonProcess.kill();
      res.status(401).json({ message: 'Unauthorized. Face recognition timeout.' });
    }, 40000);

    pythonProcess.stdout.on('data', async (data) => {
      clearTimeout(timeout);
      const returnedUserId = data.toString().trim();

      // Check if the returned user ID is the same as the ID of the user who is logging in
      if (returnedUserId === user._id.toString()) {
        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
          const payload = {
            id: user._id,
            username: user.username,
          };

          jwt.sign(
            payload,
            process.env.JWT_SECRET,
            (err, token) => {
              if (err) {
                return res.status(500).json({ message: "Error signing token" });
              }
              return res.status(200).json({
                token: token,
                user: JSON.stringify(user),
              });
            }
          );
        } else {
          return res.status(400).json({ message: "Invalid Username or Password" });
        }
      } else {
        return res.status(402).json({ message: 'Unauthorized. Face recognition failed.' });
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
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

// Find user by username
router.get('/find/:username', verifyToken, async (req, res) => {
  try {
    const username = req.params.username;
    const foundUser = await User.findOne({ username });

    if (!foundUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(foundUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Find users by address
router.get('/find/address/:address', verifyToken, async (req, res) => {
  try {
    const address = req.params.address;
    const foundUsers = await User.find({ address });
    if (foundUsers.length === 0) {
      return res.status(404).json({ error: 'No users found with the provided address' });
    }
    res.json(foundUsers);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//find users by role
router.get('/find/role/:role', verifyToken, async (req, res) => {
  try {
    const role = req.params.role;
    const foundUsers = await User.find({ role });

    if (foundUsers.length === 0) {
      return res.status(404).json({ error: 'No users found with the provided role' });
    }
    res.json(foundUsers);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
