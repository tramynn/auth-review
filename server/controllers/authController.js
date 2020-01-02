const bcrypt = require("bcryptjs");

// Grab user
async function getUser(req, res) {
  // If user is on session then send the user on session
  if (req.session.user) {
    res.status(200).json(req.session.user);
  }
}

// Register user
async function registerUser(req, res) {
  const { username, password } = req.body;
  const db = req.app.get("db");

  // Check if user exists
  const foundUser = await db.auth.checkForUsername(username);

  // If user is found, send message that user exists
  if (foundUser[0]) {
    res.status(401).json("User already exists.")
    // Otherwise, create a new user
  } else {
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(password, salt);

    const newUser = await db.auth.registerUser([username, hash])

    // Store registered user into session
    req.session.user = {
      users_id: newUser[0].users_id,
      username: newUser[0].username
    }

    // Send user on session
    res.status(200).json(req.session.user)
  }
}

// Login user
async function loginUser(req, res) {
  const { username, password } = req.body;
  const db = req.app.get("db");

  // Check if user exists
  const foundUser = await db.auth.checkForUsername(username)

  // If user is not found, then send message saying so
  if (!foundUser[0]) {
    res.status(400).json("No user found.")
  } else {
    // Otherwise, check if password matches the hashed password
    const isAuthenticated = await bcrypt.compareSync(password, foundUser[0].hash);
    // If password doesn't match hashed password, send message saying so
    if (!isAuthenticated) {
      res.status(403).json("Password is incorrect")
      // Otherwise, store the found user in session
    } else {
      req.session.user = {
        users_id: foundUser[0].users_id,
        username: foundUser[0].username
      }

      // Send user on session
      res.status(200).json(req.session.user)
    }
  }
}

// Logout user
async function logoutUser(req, res) {
  req.session.destroy();
  res.sendStatus(200);
}

module.exports = {
  getUser,
  registerUser,
  loginUser,
  logoutUser
}