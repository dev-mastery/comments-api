import axios from 'axios'
import commentsDb, { makeDb } from '../src/data-access'
import makeFakeComment from './fixtures/comment'
import dotenv from 'dotenv'
dotenv.config()

describe('Comments API', () => {
  beforeAll(() => {
    axios.defaults.baseURL = process.env.DM_BASE_URL + process.env.DM_API_ROOT
    axios.defaults.headers.common['Content-Type'] = 'application/json'
    axios.defaults.validateStatus = function (status) {
      // Throw only if the status code is greater than or equal to 500
      return status < 500
    }
  })
  afterAll(async () => {
    const db = await makeDb()
    return db.collection('comments').drop()
  })

  describe('adding comments', () => {
    // Content moderator API only allows 1 request per second.
    beforeEach(done => setTimeout(() => done(), 1100))
    it('adds a comment to the database', async () => {
      const response = await axios.post(
        '/comments/',
        makeFakeComment({
          id: undefined,
          text: 'Something safe and intelligible.'
        })
      )
      expect(response.status).toBe(201)
      const { posted } = response.data
      const doc = await commentsDb.findById(posted)
      expect(doc).toEqual(posted)
      expect(doc.published).toBe(true)
      return commentsDb.remove(posted)
    })
    it('requires comment to contain an author', async () => {
      const response = await axios.post(
        '/comments',
        makeFakeComment({ id: undefined, author: undefined })
      )
      expect(response.status).toBe(400)
      expect(response.data.error).toBeDefined()
    })
    it('requires comment to contain text', async () => {
      const response = await axios.post(
        '/comments',
        makeFakeComment({ id: undefined, text: undefined })
      )
      expect(response.status).toBe(400)
      expect(response.data.error).toBeDefined()
    })
    it('requires comment to contain a valid postId', async () => {
      const response = await axios.post(
        '/comments',
        makeFakeComment({ id: undefined, postId: undefined })
      )
      expect(response.status).toBe(400)
      expect(response.data.error).toBeDefined()
    })
    it('scrubs malicious content', async () => {
      const response = await axios.post(
        '/comments',
        makeFakeComment({
          id: undefined,
          text: '<script>attack!</script><p>hello!</p>'
        })
      )
      expect(response.status).toBe(201)
      expect(response.data.posted.text).toBe('<p>hello!</p>')
      return commentsDb.remove(response.data.posted)
    })
    it("won't publish profanity", async () => {
      const profane = makeFakeComment({ id: undefined, text: 'You suck!' })
      const response = await axios.post('/comments', profane)
      expect(response.status).toBe(201)
      expect(response.data.posted.published).toBe(false)
      return commentsDb.remove(response.data.posted)
    })
    it.todo("won't publish spam")
  })
  describe('modfying comments', () => {
    // Content moderator API only allows 1 request per second.
    beforeEach(done => setTimeout(() => done(), 1100))
    it('modifies a comment', async () => {
      const comment = makeFakeComment({
        text: '<p>changed!</p>'
      })
      await commentsDb.insert(comment)
      const response = await axios.patch(`/comments/${comment.id}`, comment)
      expect(response.status).toBe(200)
      expect(response.data.patched.text).toBe('<p>changed!</p>')
      return commentsDb.remove(comment)
    })
    it('scrubs malicious content', async () => {
      const comment = makeFakeComment({
        text: '<script>attack!</script><p>hello!</p>'
      })
      await commentsDb.insert(comment)
      const response = await axios.patch(`/comments/${comment.id}`, comment)
      expect(response.status).toBe(200)
      expect(response.data.patched.text).toBe('<p>hello!</p>')
      return commentsDb.remove(comment)
    })
  })
  describe('listing comments', () => {
    it('lists comments for a post', async () => {
      const comment1 = makeFakeComment({ replyToId: null })
      const comment2 = makeFakeComment({
        postId: comment1.postId,
        replyToId: null
      })
      const comments = [comment1, comment2]
      const inserts = await Promise.all(comments.map(commentsDb.insert))
      const expected = [
        {
          ...comment1,
          replies: [],
          createdOn: inserts[0].createdOn
        },
        {
          ...comment2,
          replies: [],
          createdOn: inserts[1].createdOn
        }
      ]
      const response = await axios.get('/comments/', {
        params: { postId: comment1.postId }
      })
      expect(response.data).toContainEqual(expected[0])
      expect(response.data).toContainEqual(expected[1])
      return comments.map(commentsDb.remove)
    })
    it('threads comments', async done => {
      const comment1 = makeFakeComment({ replyToId: null })
      const reply1 = makeFakeComment({
        postId: comment1.postId,
        replyToId: comment1.id
      })
      const reply2 = makeFakeComment({
        postId: comment1.postId,
        replyToId: reply1.id
      })
      const comment2 = makeFakeComment({
        postId: comment1.postId,
        replyToId: null
      })
      const comments = [comment1, reply1, reply2, comment2]
      const inserts = await Promise.all(comments.map(commentsDb.insert))
      const expected = [
        {
          ...comment1,
          replies: [
            {
              ...reply1,
              createdOn: inserts[1].createdOn,
              replies: [
                {
                  ...reply2,
                  createdOn: inserts[2].createdOn,
                  replies: []
                }
              ]
            }
          ],
          createdOn: inserts[0].createdOn
        },
        {
          ...comment2,
          replies: [],
          createdOn: inserts[3].createdOn
        }
      ]
      const response = await axios.get('/comments/', {
        params: { postId: comment1.postId }
      })
      // FIXME: Fix flake. Why timeout? Mongo or promise?
      setTimeout(async () => {
        expect(response.data[0].replies.length).toBe(1)
        expect(response.data[0].replies[0].replies.length).toBe(1)
        expect(response.data).toContainEqual(expected[1])
        expect(response.data).toContainEqual(expected[0])
        done()
      }, 1100)
    })
  })
  describe('deleting comments', () => {
    it('hard deletes', async () => {
      const comment = makeFakeComment()
      await commentsDb.insert(comment)
      const result = await axios.delete(`/comments/${comment.id}`)
      expect(result.data.deleted.deletedCount).toBe(1)
      expect(result.data.deleted.softDelete).toBe(false)
    })
    it('soft deletes', async () => {
      const comment = makeFakeComment()
      const reply = makeFakeComment({ replyToId: comment.id })
      await commentsDb.insert(comment)
      await commentsDb.insert(reply)
      const result = await axios.delete(`/comments/${comment.id}`)
      expect(result.data.deleted.deletedCount).toBe(1)
      expect(result.data.deleted.softDelete).toBe(true)
    })
  })
})
