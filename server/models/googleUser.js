const mongoose = require("mongoose");

const googleUserSchema = new mongoose.Schema({
       email: String,
       name: String,
       googleId: String
}, { timestamps: true})

module.exports = mongoose.model("GoogleUser", googleUserSchema)
