const mongoose = require("mongoose");

const googleUserOneTapSchema = new mongoose.Schema({
       email: String,
       name: String,
       picture: String
}, { timestamps: true })

module.exports = mongoose.model("GoogleUserOneTap", googleUserOneTapSchema)
