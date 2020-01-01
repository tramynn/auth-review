require("dotenv").config();
const express = require("express");
const massive = require("massive");
const session = require("express-session");
const app = express();
// Controllers
const ac = require("./controllers/authController")
// Dotenv
const { SERVER_PORT, SESSION_SECRET, CONNECTION_STRING } = process.env;

// Middleware
app.use(express.json());

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}));

// Database connection
massive(CONNECTION_STRING).then(db => {
  app.set("db", db);
  console.log("db connected!");
})

// Destructured authController
const { getUser, registerUser, loginUser, logoutUser } = ac;

// Auth endpoints
app.get("/auth/user", getUser);
app.post("/auth/register", registerUser);
app.post("/auth/login", loginUser);
app.post("/auth/logout", logoutUser);

app.listen(SERVER_PORT, () => {
  console.log(`SERVER LISTENING ON PORT: ${SERVER_PORT}`)
})
