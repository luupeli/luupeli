const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const User = require('../models/user')
const { initialUsers2 } = require('./user_test_helper')

const url = '/api/login'

describe('when there is initially some users in database', async () => {
  beforeAll(async () => {
    jest.setTimeout(30000)
    await User.remove({})
    const userObjects = initialUsers2.map(u => new User(u))
    await Promise.all(userObjects.map(u => u.save()))
  })

  test('a token is returned with status code 200 by POST /api/login with existing username and correct password', async () => {
    const loginData = {
      username: 'spinoza',
      password: 'sub_specie_aeternitatis'
    }

    const response = await api
      .post(url)
      .send(loginData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.token)
    // console.log('token: ' + response.body.token)
  })

  test('status code 401 is returned when attempting to POST /api/login with incorrect username', async () => {
    const loginData = {
      username: 'kimjongil',
      password: 'cognitivedissonance'
    }

    await api
      .post(url)
      .send(loginData)
      .expect(401)
  })

  test('status code 401 is returned when attempting to POST /api/login with correct username but incorrect password', async () => {
    const loginData = {
      username: 'zizek',
      password: 'howmanypotatoesdoyouneedtokillanirishman_..._zero'
    }

    await api
      .post(url)
      .send(loginData)
      .expect(401)
  })

  afterAll(() => {
    server.close()
  })
})