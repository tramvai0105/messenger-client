const {Schema, model} = require("mongoose")

const userSchema = new Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    avatar: {type: String, default: "http://localhost:5000/images/elvis.jpg"}
  });

module.exports = model("User", userSchema);