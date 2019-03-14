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
    const firstComment = makeFakeComment({ replyToId: null })
    const secondComment = makeFakeComment({
      replyToId: null,
      postId: firstComment.postId
    })
    const thirdComment = makeFakeComment({
      replyToId: null,
      postId: firstComment.postId
    })
    const replyToIdFirstComment = makeFakeComment({
      replyToId: firstComment.id,
      postId: firstComment.postId
    })
    const anotherReplyToFirstComment = makeFakeComment({
      replyToId: firstComment.id,
      postId: firstComment.postId
    })
    const replyToIdSecondComment = makeFakeComment({
      replyToId: secondComment.id,
      postId: firstComment.postId
    })
    const comments = [
      firstComment,
      secondComment,
      thirdComment,
      replyToIdFirstComment,
      anotherReplyToFirstComment,
      replyToIdSecondComment
    ]

    const inserted = await Promise.all(comments.map(commentsDb.insert))

    const expectedGraph = [
      {
        ...firstComment,
        replies: [replyToIdFirstComment, anotherReplyToFirstComment]
      },
      { ...secondComment, replies: [replyToIdSecondComment] },
      { ...thirdComment, replies: [] }
    ]
    const actualGraph = await getComments({ postId: firstComment.postId })
    expect(actualGraph).toEqual(expectedGraph)

    // return Promise.all(comments.map(commentsDb.remove))
  })
})
