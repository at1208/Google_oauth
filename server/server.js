const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = require('express')();
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require("passport");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser"); // parse cookie header


require('dotenv').config();
require('./services/passport');

const authRoutes = require('./routers/auth_router');

app.use(
  cors({
    origin: "http://localhost:3000", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // allow session cookie from browser to pass through
  }))
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(
  cookieSession({
  maxAge: 30*24*60*60*1000,        // in milli seconds
  keys: [process.env.COOKIEKEY]
}))
app.use(cookieParser());
app.use(passport.initialize())
app.use(passport.session());

app.use('/api', authRoutes);

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({
      authenticated: false,
      message: "user has not been authenticated"
    });
  } else {
    next();
  }
};

app.get("/", authCheck, (req, res) => {
  res.status(200).json({
    authenticated: true,
    message: "user successfully authenticated",
    user: req.user,
    cookies: req.cookies
  });
});

mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connected to DB'))
    .catch(err => {
        console.log(err);
    });

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
