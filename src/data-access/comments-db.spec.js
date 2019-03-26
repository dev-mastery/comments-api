import makeDb from '../../__test__/fixtures/db'
import makeCommentsDb from './comments-db'
import makeFakeComment from '../../__test__/fixtures/comment'

describe('comments db', () => {
  let commentsDb

  beforeEach(async () => {
    commentsDb = makeCommentsDb({ makeDb })
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

  it("finds a comment by it's hash", async () => {
    // expect.assertions(2)
    const fakeCommentOne = makeFakeComment()
    const fakeCommentTwo = makeFakeComment()
    const insertedOne = await commentsDb.insert(fakeCommentOne)
    const insertedTwo = await commentsDb.insert(fakeCommentTwo)

    expect(await commentsDb.findByHash(fakeCommentOne)).toEqual(insertedOne)
    expect(await commentsDb.findByHash(fakeCommentTwo)).toEqual(insertedTwo)
  })

  it('updates a comment', async () => {
    const comment = makeFakeComment()
    await commentsDb.insert(comment)
    comment.text = 'changed'
    const updated = await commentsDb.update(comment)
    return expect(updated.text).toBe('changed')
  })

  it('finds all comments for a post', async () => {
    const commentOnPostA = makeFakeComment()
    const commentOnPostB = makeFakeComment({ replyToId: null })
    await Promise.all([commentOnPostA, commentOnPostB].map(commentsDb.insert))

    expect(
      (await commentsDb.findByPostId({
        postId: commentOnPostA.postId,
        omitReplies: false
      }))[0]
    ).toEqual(commentOnPostA)

    expect(
      (await commentsDb.findByPostId({
        postId: commentOnPostA.postId,
        omitReplies: true
      }))[0]
    ).not.toEqual(commentOnPostA)

    return expect(
      (await commentsDb.findByPostId({
        postId: commentOnPostB.postId,
        omitReplies: true
      }))[0]
    ).toEqual(commentOnPostB)
  })

  it('finds all replies to a comment', async () => {
    const comment = makeFakeComment()
    const firstReply = makeFakeComment({ replyToId: comment.id })
    const secondReply = makeFakeComment({ replyToId: comment.id })
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
