const express = require('express');
const passport = require("passport");
const router = express.Router();

const { current_user, logout_user, login_failed } = require("../controllers/auth_controller");

router.get('/auth/google', passport.authenticate("google", {
  scope: ["profile", "email"]
}))

router.get("/auth/login/failed", login_failed);
router.get('/auth/google/callback', passport.authenticate("google", { successRedirect: process.env.CLIENT_URL, failureRedirect: "/auth/login/failed"}))
router.get("/auth/currentUser", current_user)
router.get("/auth/logout", logout_user)

module.exports = router;
