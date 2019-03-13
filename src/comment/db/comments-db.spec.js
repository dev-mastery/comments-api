import makeDb, { closeDb, clearDb } from '../../../__test__/fixtures/db'
import makeCommentsDb from './comments-db'
import makeFakeComment from '../../../__test__/fixtures/comment'

describe('comments db', () => {
  let commentsDb

  beforeEach(async () => {
    commentsDb = makeCommentsDb({ makeDb })
  })

  afterEach(async () => {
    await clearDb()
    return true
  })

  afterAll(async () => {
    await closeDb()
    return true
  })

  it('lists comments', async () => {
    const inserts = await Promise.all(
      [makeFakeComment(), makeFakeComment(), makeFakeComment()].map(
        commentsDb.insert
      )
    )
    const found = await commentsDb.findAll()
    expect.assertions(inserts.length)
    return inserts.forEach(insert => expect(found).toContainEqual(insert))
  })

  it('inserts a comment', async () => {
    const comment = makeFakeComment()
    const result = await commentsDb.insert(comment)
    return expect(result).toEqual(comment)
  })

  it('finds a comment by id', async () => {
    const comment = makeFakeComment()
    await commentsDb.insert(comment)
    const found = await commentsDb.findById(comment)
    expect(found).toEqual(comment)
  })

  it('updates a comment', async () => {
    const comment = makeFakeComment()
    await commentsDb.insert(comment)
    comment.author = 'changed'
    const updated = await commentsDb.update(comment)
    return expect(updated.author).toBe('changed')
  })

  it('finds all comments for a post', async () => {
    const commentOnPostA = makeFakeComment()
    const commentOnPostB = makeFakeComment({ inReplyToCommentId: null })
    await Promise.all([commentOnPostA, commentOnPostB].map(commentsDb.insert))

    expect(
      (await commentsDb.findByPostId({
        postId: commentOnPostA.onPostId,
        omitReplies: false
      }))[0]
    ).toEqual(commentOnPostA)

    expect(
      (await commentsDb.findByPostId({
        postId: commentOnPostA.onPostId,
        omitReplies: true
      }))[0]
    ).not.toEqual(commentOnPostA)

    return expect(
      (await commentsDb.findByPostId({
        postId: commentOnPostB.onPostId,
        omitReplies: true
      }))[0]
    ).toEqual(commentOnPostB)
  })

  it('finds all replies to a comment', async () => {
    const comment = makeFakeComment()
    const firstReply = makeFakeComment({ inReplyToCommentId: comment.id })
    const secondReply = makeFakeComment({ inReplyToCommentId: comment.id })
    await Promise.all([comment, firstReply, secondReply].map(commentsDb.insert))
    const found = await commentsDb.findReplies({ commentId: comment.id })
    expect(found).toContainEqual(firstReply)
    expect(found).toContainEqual(secondReply)
    expect(found).not.toContainEqual(comment)
  })

  it('deletes a comment', async () => {
    const comment = makeFakeComment()
    await commentsDb.insert(comment)
    return expect(await commentsDb.remove(comment)).toBe(1)
  })
})
