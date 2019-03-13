import axios from 'axios'
import commentsDb from '../src/comment/db'
import makeFakeComment from './fixtures/comment'
import dotenv from 'dotenv'
dotenv.config()

describe('post comment', () => {
  beforeAll(() => {
    axios.defaults.baseURL = process.env.DM_BASE_URL
    axios.defaults.headers.common['Content-Type'] = 'application/json'
    axios.defaults.validateStatus = function (status) {
      // Throw only if the status code is greater than or equal to 500
      return status < 500
    }
  })
  // Content moderator API only allows 1 request per second.
  afterEach(done => setTimeout(() => done(), 1001))

  it('adds a comment to the database', async () => {
    const response = await axios.post('/comments', makeFakeComment())
    expect(response.status).toBe(201)
    const doc = await commentsDb.findById(response.data)
    expect(doc).toEqual(response.data)
    expect(doc.published).toBe(true)
    return commentsDb.remove(response.data)
  })
  it('requires comment to contain an author', async () => {
    const response = await axios.post(
      '/comments',
      makeFakeComment({ author: undefined })
    )
    expect(response.status).toBe(400)
    expect(response.data.error).toBeDefined()
  })
  it('requires comment to contain contents', async () => {
    const response = await axios.post(
      '/comments',
      makeFakeComment({ contents: undefined })
    )
    expect(response.status).toBe(400)
    expect(response.data.error).toBeDefined()
  })
  it('requires comment to contain a valid onPostId', async () => {
    const response = await axios.post(
      '/comments',
      makeFakeComment({ onPostId: undefined })
    )
    expect(response.status).toBe(400)
    expect(response.data.error).toBeDefined()
  })
  it('scrubs malicious content', async () => {
    const response = await axios.post(
      '/comments',
      makeFakeComment({ contents: '<script>attack!</script><p>hello!</p>' })
    )
    expect(response.status).toBe(201)
    expect(response.data.contents).toBe('<p>hello!</p>')
    return commentsDb.remove(response.data)
  })
  it("won't publish profanity", async () => {
    const profane = makeFakeComment({ contents: 'You suck!' })
    const response = await axios.post('/comments', profane)
    expect(response.status).toBe(201)
    expect(response.data.published).toBe(false)
    return commentsDb.remove(response.data)
  })
})
