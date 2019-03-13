import makeGetComments from './list-post-comments'
import makeCommentsDb from '../db/comments-db'
import makeFakeComment from '../../../__test__/fixtures/comment'
import makeDb from '../../../__test__/fixtures/db'

describe('get comments', () => {
  let commentsDb, getComments
  beforeAll(() => {
    commentsDb = makeCommentsDb({ makeDb })
    getComments = makeGetComments({ commentsDb })
  })

  it('requires a post id', () => {
    expect(getComments()).rejects.toThrow('You must supply a post id.')
  })
  xit('gets all comments', async () => {
    const firstComment = makeFakeComment({ inReplyToCommentId: null })
    const secondComment = makeFakeComment({
      inReplyToCommentId: null,
      onPostId: firstComment.onPostId
    })
    const thirdComment = makeFakeComment({
      inReplyToCommentId: null,
      onPostId: firstComment.onPostId
    })
    const replyToFirstComment = makeFakeComment({
      inReplyToCommentId: firstComment.id,
      onPostId: firstComment.onPostId
    })
    const anotherReplyToFirstComment = makeFakeComment({
      inReplyToCommentId: firstComment.id,
      onPostId: firstComment.onPostId
    })
    const replyToSecondComment = makeFakeComment({
      inReplyToCommentId: secondComment.id,
      onPostId: firstComment.onPostId
    })
    const comments = [
      firstComment,
      secondComment,
      thirdComment,
      replyToFirstComment,
      anotherReplyToFirstComment,
      replyToSecondComment
    ]

    const inserted = await Promise.all(comments.map(commentsDb.insert))

    const expectedGraph = [
      {
        ...firstComment,
        replies: [replyToFirstComment, anotherReplyToFirstComment]
      },
      { ...secondComment, replies: [replyToSecondComment] },
      { ...thirdComment, replies: [] }
    ]
    const actualGraph = await getComments({ postId: firstComment.onPostId })
    expect(actualGraph).toEqual(expectedGraph)

    // return Promise.all(comments.map(commentsDb.remove))
  })
})
