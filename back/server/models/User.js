const mongoose = require("mongoose");

const Roles = {
    User: "User",
    Admin: "Admin",
  };

const UserSchema = new mongoose.Schema({
    _id: Number,
    username: {
        type: String,
        required: true,
        unique: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    phonenumber: {
        type: Number,
        required: false,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: Object.values(Roles),
        default: Roles.Member,
    },
    place: {
        type: String,
        required: true,
    },
    approved: {
        type: Boolean,
        default: false,
    },
    ip: {
        type: [String],
        required: false,
    },
},
    { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;



