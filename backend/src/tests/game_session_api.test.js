const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const GameSession = require('../models/gameSession')
const { initialGameSessions, gameSessionsToBeAdded, formatGameSAession, gameSessionsInDb } = require('./game_session_test_helper')

const url = '/api/gamesessions'

describe('when there are initially some game sessions saved', async () => {

  beforeAll(async () => {
		jest.setTimeout(30000)
		await GameSession.remove({})
		const sessions = initialGameSessions.map(gs => new GameSession(gs))
		await Promise.all(sessions.map(gs => gs.save()))
  })
  
  test('all sessions are returned as JSON by GET /api/gamesessions', async () => {
    const sessionsInDatabase = await gameSessionsInDb()
    const res = await api
      .get(url)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(res.body.length).toBe(sessionsInDatabase.length)

    const returnedGameSessions = res.body.map(g => g.mode)
    sessionsInDatabase.forEach(gameSession => {
      expect(returnedGameSessions).toContain(gameSession.mode)
    })
  })

  test('individuals sessions are returned as JSON by GET /api/gamesessions/:id', async () => {
    const sessionsInDatabase = await gameSessionsInDb()
    const session = sessionsInDatabase[0]

    const res = await api
      .get(url + '/' + session.id)
      .expect(200)
      .expect('Content-Type', /application\/json/)

      expect(res.body.mode).toBe(session.mode)
  })

  describe('addition of a new session', async () => {
    /*
    test('successfully adds a valid game session by POST /api/gamesessions', async () => {
      const sessionsAtStart = await gameSessionsInDb()

      const newSession = gameSessionsToBeAdded[0]

      await api
        .post(url)
        .send(newSession)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const sessionsAfterPost = await gameSessionsInDb()
      expect(sessionsAfterPost.length).toBe(sessionsAtStart.length + 1)
      const modes = sessionsAfterPost.map(g => g.mode)
      
      expect(modes).toContain('kimblepeli')
    }) */

    test('400 is returned when post lacks data', async () => {
      const sessionsAtStart = await gameSessionsInDb()
      const session = sessionsAtStart[1]

      await api
        .post(url)
        .send(session)
        .expect(400)

        const sessionsAfterPost = await gameSessionsInDb()
        expect(sessionsAfterPost.length).toBe(sessionsAtStart.length)
    })
  })

  //** Disabled these test just in case we won't need put */
  // describe('updating a session', async () => {
  //   test('successfully updates a session by PUT /api/gamesessions/:id', async () =>  {
  //     const sessionsAtStart = await gameSessionsInDb()
  //     let sessionToBeUpdated = sessionsAtStart[0]
  //     let oldMode = sessionToBeUpdated.mode

  //     sessionToBeUpdated.mode = 'muokattupelimuoto'
  //     console.log(sessionToBeUpdated)
  //     await api
  //       .put(url + '/' + sessionToBeUpdated.id)
  //       .send(sessionToBeUpdated)
  //       .expect(200)

  //     const sessionsAfterPut = await gameSessionsInDb()
  //     const modes = sessionsAfterPut.map(g => g.mode)
  //     expect(modes).toContain('muokattupelimuoto')
  //     expect(modes).not.toContain(oldMode)
  //   })

  //   test('400 statuscode is returned when PUT /api/gamesessions/:id is done with malformatted id', async () => {
  //     const sessionsAtStart = await gameSessionsInDb()
  //     const invalidId = 'd7dsatgfds6wda'
  //     const newSession = gameSessionsToBeAdded[2]

  //     await api
  //       .put(url + '/' + invalidId)
  //       .send(newSession)
  //       .expect(400)

  //     const sessionsAfterPut = await gameSessionsInDb()
  //     const modes = sessionsAfterPut.map(g => g.mode)
  //     expect(modes).toContain('muokattupelimuoto')
  //     expect(modes).not.toContain(oldMode)
  //   })
  // })

  afterAll(() => {
    server.close()
  })


})