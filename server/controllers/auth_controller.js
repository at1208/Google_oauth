

module.exports.current_user = (req, res) => {
  res.json(req.user)
}

module.exports.logout_user = (req, res) => {
   req.logout()
   res.redirect(process.env.CLIENT_URL)
}

module.exports.login_failed = (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate."
  });
}
