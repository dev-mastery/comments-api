import makeRemoveComment from './remove-comment'
import makeCommentsDb from '../data-access/comments-db'
import makeFakeComment from '../../__test__/fixtures/comment'
import makeDb from '../../__test__/fixtures/db'
import makeComment from '../comment'

describe('remove comment', () => {
  let commentsDb
  beforeAll(() => {
    commentsDb = makeCommentsDb({ makeDb })
  })
  it('handles non existent comments', async () => {
    const removeComment = makeRemoveComment({
      commentsDb
    })
    const fakeComment = makeFakeComment()
    const expected = {
      deletedCount: 0,
      softDelete: false,
      message: 'Comment not found, nothing to delete.'
    }
    const actual = await removeComment(fakeComment)
    expect(actual).toEqual(expected)
  })
  it('hard deletes comments with zero replies', async () => {
    const removeComment = makeRemoveComment({
      commentsDb
    })

    const fakeComment = makeFakeComment()
    await commentsDb.insert(fakeComment)

    const found = await commentsDb.findById(fakeComment)
    expect(found).toEqual(fakeComment)

    const expected = {
      deletedCount: 1,
      softDelete: false,
      message: 'Comment deleted.'
    }

    const actual = await removeComment(fakeComment)
    expect(actual).toEqual(expected)

    const notFound = await commentsDb.findById(fakeComment)
    expect(notFound).toBe(null)
  })
  it('soft deletes comments with 1 or more replies ', async () => {
    const removeComment = makeRemoveComment({
      commentsDb
    })

    const fakeComment = makeFakeComment()
    await commentsDb.insert(fakeComment)

    const fakeCommentReply = makeFakeComment({
      replyToId: fakeComment.id
    })
    await commentsDb.insert(fakeCommentReply)

    const expected = {
      deletedCount: 1,
      softDelete: true,
      message: 'Comment has replies. Soft deleted.'
    }
    const actual = await removeComment(fakeComment)
    expect(actual).toEqual(expected)

    const deleted = await commentsDb.findById(fakeComment)
    expect(makeComment(deleted).isDeleted()).toBe(true)
    await commentsDb.remove(fakeCommentReply)
    await commentsDb.remove(fakeComment)
  })
  it('hard deletes a comment and its deleted parent when there are no other replies', async () => {
    const removeComment = makeRemoveComment({
      commentsDb
    })

    const fakeComment = makeFakeComment()

    const fakeReply = makeFakeComment({
      replyToId: fakeComment.id,
      postId: fakeComment.postId,
      published: true
    })
    console.log({ fakeReply })
    const [insertedParent, insertedReply] = await Promise.all([
      commentsDb.insert(fakeComment),
      commentsDb.insert(fakeReply)
    ])
    const parentDelete = await removeComment(insertedParent)
    expect(parentDelete.softDelete).toBe(true)

    const expected = {
      deletedCount: 2,
      softDelete: false,
      message: 'Comment and parent deleted.'
    }
    const actual = await removeComment(insertedReply)
    expect(actual).toEqual(expected)

    await commentsDb.remove(fakeReply)
    await commentsDb.remove(fakeComment)
  })
})
