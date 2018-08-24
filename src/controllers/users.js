const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

const saltRounds = 7
const alphanumericalRegExpPattern = new RegExp(/^[a-zA-Z0-9_]*$/)

// Finds all users from database after GET-request and returns in JSON
usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users.map(User.format))
})

// Finds and returns one user in JSON
usersRouter.get('/:id', async (request, response) => {
  try {
    const user = await User
      .findById(request.params.id)
    if (user) {
      response.json(User.format(user))
    } else {
      response.status(404).end()
    }
  } catch (err) {
    console.log(err)
    response.status(404).send({ error: 'malformatted id' })
  }
})

// Creates a user from given request and saves it to the database
// Uses bcrypt for password hashing
// Username must be unique and longer or equal to 3 alphanumerical characters
// Password must be longer or equal to 8 characters
usersRouter.post('/', async (request, response) => {
  try {
    const body = request.body
    // Finds an existing user for name uniqueness
    const existingUser = await User.find({ username: body.username })
    // Requirements -- errors make these self-explanotory
    if (body.username === undefined) {
      return response.status(400).json({ error: 'name missing' })
    } else if (body.password === undefined) {
      return response.status(400).json({ error: 'password missing' })
    } else if (existingUser.length > 0) {
      return response.status(400).json({ error: 'username must be unique' })
    } else if (body.username.length < 3) {
      return response.status(400).json({ error: 'username must be longer or equal to 3 characters' })
    } else if (body.password.length < 8) {
      return response.status(400).json({ error: 'password must be longer or equal to 8 characters' })
    } else if (!body.username.match(alphanumericalRegExpPattern)) {
      return response.status(400).json({ error: 'username must contain only alphanumerical characters a-z, 0-9' })
    }
    let email
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    const assignedRole = "USER"
    // Sets email to null if none is given
    if (body.email != undefined) {
      email = body.email
    } else { email = null }
    const user = new User({
      username: body.username.toLowerCase(),
      email,
      passwordHash,
      role: assignedRole
    })

    const savedUser = await user.save()
    response.json(User.format(savedUser))
  } catch (err) {
    console.log(err)
    response.status(500).json({ error: 'something went wrong' })
  }
})

// Finds one user by id and deletes it from database
usersRouter.delete('/:id', async (request, response) => {
  try {
    const user = await User.findById(request.params.id)
    await User.remove(user)
    response.status(204).end()
  } catch (err) {
    console.log(err)
    response.status(400).send({ error: 'malformatted id' })
  }
})

// Updates user info according to request and saves it
// User has same requirements when updating as when creating it
usersRouter.put('/:id', async (request, response) => {
  try {
    const body = request.body
    const oldUser = await User.findById(request.params.id)

    if (!oldUser) {
      response.status(404).end()
    }

    // Searches an existing user for name uniqueness
    const existingUser = await User.find({ username: body.username })
    // Requirements -- errors make these self-explanotory
    // Checks if user with the taken name is not the same user
    if (existingUser.length > 0 && existingUser[0].id !== oldUser.id) {
      console.log('username must be unique')
      return response.status(400).json({ error: 'username must be unique' })
    } else if (body.username !== undefined && body.username.length <= 3) {
      console.log('username >= 3')
      return response.status(400).json({ error: 'username must be longer or equal to 3 characters' })
    } else if (body.password !== undefined && body.password.length <= 8) {
      console.log('password >= 8')
      return response.status(400).json({ error: 'password must be longer or equal to 8 characters' })
    } else if (body.username !== undefined && !body.username.match(alphanumericalRegExpPattern)) {
      console.log('username must be alphanumeric')
      return response.status(400).json({ error: 'username must contain only alphanumerical characters a-z, 0-9' })
    }
    // Create a placeholder for user
    let user
    // Checks if a new password is given
    if (body.password) {
      // Hash it
      const passwordHash = await bcrypt.hash(body.password, saltRounds)
      // Checks if a new username is given
      if (body.username) {
        // Insert new information
        user = {
          username: body.username,
          passwordHash
        }
        // Insert old username and new hashed password
      } else {
        user = {
          username: oldUser.username,
          passwordHash
        }
      }
      // Checks if a new name is given
    } else if (body.username) {
      // Insert new username and old hashed password
      user = {
        username: body.username,
        passwordHash: oldUser.passwordHash
      }
    }

    const updatedUser = await User.findByIdAndUpdate(request.params.id, user, { new: true })
    response.json(User.format(updatedUser))
  } catch (err) {
    console.log(err)
    response.status(400).send({ error: 'malformatted id' })
    console.log('malformatted id')
  }
})

module.exports = usersRouter