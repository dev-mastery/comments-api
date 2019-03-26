import makeGetComments from './list-comments'
import makeCommentsDb from '../data-access/comments-db'
import makeFakeComment from '../../__test__/fixtures/comment'
import makeDb from '../../__test__/fixtures/db'

describe('get comments', () => {
  let commentsDb, getComments
  beforeAll(() => {
    commentsDb = makeCommentsDb({ makeDb })
    getComments = makeGetComments({ commentsDb })
  })

  it('requires a post id', () => {
    expect(getComments()).rejects.toThrow('You must supply a post id.')
  })
  it('gets all comments', async () => {
    const firstComment = makeFakeComment({ replyToId: null })
    const secondComment = makeFakeComment({
      replyToId: null,
      postId: firstComment.postId
    })
    const thirdComment = makeFakeComment({
      replyToId: null,
      postId: firstComment.postId
    })
    const replyToFirstComment = makeFakeComment({
      replyToId: firstComment.id,
      postId: firstComment.postId
    })
    const anotherReplyToFirstComment = makeFakeComment({
      replyToId: firstComment.id,
      postId: firstComment.postId
    })
    const replyToSecondComment = makeFakeComment({
      replyToId: secondComment.id,
      postId: firstComment.postId
    })
    const comments = [
      firstComment,
      secondComment,
      thirdComment,
      replyToFirstComment,
      anotherReplyToFirstComment,
      replyToSecondComment
    ]
    await Promise.all(comments.map(commentsDb.insert))
    const actualGraph = await getComments({ postId: firstComment.postId })

    const firstCommentFromDb = actualGraph.filter(c => c.id === firstComment.id)
    expect(firstCommentFromDb[0].replies.length).toBe(2)
    expect(firstCommentFromDb[0].replies).toContainEqual({
      ...replyToFirstComment,
      replies: []
    })
    expect(firstCommentFromDb[0].replies).toContainEqual({
      ...anotherReplyToFirstComment,
      replies: []
    })

    const secondCommentFromDb = actualGraph.filter(
      c => c.id === secondComment.id
    )
    expect(secondCommentFromDb[0].replies.length).toBe(1)
    expect(secondCommentFromDb[0].replies).toContainEqual({
      ...replyToSecondComment,
      replies: []
    })

    const thirdCommentFromDb = actualGraph.filter(c => c.id === thirdComment.id)
    expect(thirdCommentFromDb[0].replies.length).toBe(0)
    return Promise.all(comments.map(commentsDb.remove))
  })
})
