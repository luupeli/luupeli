const User = require('../models/user')
const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Controller to handle login
loginRouter.post('/', async (request, response) => {
  // Creates a variable from sent request
  const body = request.body
  // Tries to find an user corresponding to sent username from the database
  const user = await User.findOne({ username: body.username.toLowerCase() })
  // Checks if sent password matches the hashed password stored in the database
  const passwordCorrect = user === null ?
    false : await bcrypt.compare(body.password, user.passwordHash)
  // 401 status code is sent if no user is found or password check fails
  if (!(user && passwordCorrect)) {
    return response.status(401).send({ error: 'invalid username or password' })
  }
  // Otherwise an object is created for the token
  const userForToken = {
    username: user.username,
    id: user._id,
    role: user.role
  }
  // And lastly a token object is created and signed with jwt-library
  // The token is signed with a SECRET process environment variable
  // 200 status code is sent with the token
  const token = jwt.sign(userForToken, process.env.SECRET)
  response.status(200).send({ token, username: user.username, role: user.role, id: user._id })
})

module.exports = loginRouter