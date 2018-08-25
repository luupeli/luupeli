const User = require('../models/user')
const bcrypt = require('bcrypt')

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(formatUser)
}

const initialUsers1 = [
  {
    username: 'luidenharrastelija',
    email: 'pussipiru@luu.kek',
    passwordHash: '$2a$07$48pL4qjrKCnpyQLaneYB.OJ7PWjt3LUC7YV4nQRuqPt7MC2v666KC'
  },
  {
    username: 'bonelover',
    email: 'kaasukettu@kek.luu',
    passwordHash: '$2a$07$Mv0ITU2QUo6xM7lhlobyOeIAGc8Gpi49KoKRLd18Qsk7CdQ0QnmB6'
  },
  {
    username: 'humerus',
    email: 'rusinarousku@luu.lel',
    passwordHash: '$2a$07$tUm4BfxHIJxN3SP3b8v1MO.TTVjUbwzD124IIuBbQ3yqrmjJt4uJe'
  }
]

const initialUsers2 = [
  {
    username: 'vetstudent',
    passwordHash: '$2a$07$48pL4qjrKCnpyQLaneYB.OJ7PWjt3LUC7YV4nQRuqPt7MC2v666KC'
  },
  {
    username: 'spinoza',
    passwordHash: '$2a$07$mKoxRqrQ92nYsPMPKP8gN.bhkZl9WiAHk5yZjRBv10J1bE64q.IO6'
  },
  {
    username: 'zizek',
    passwordHash: '$2a$07$Iht66dX4FFykLsUVAvB/WOSV/.DzN1mNR3bz2tPbhxucbHA2VSNau',
    role: 'ADMIN'
  }
]

const formatUser = (user) => {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    passwordHash: user.passwordHash
  }
}

module.exports = { usersInDb, initialUsers1, initialUsers2, formatUser }