import makeAddComment from './add-comment'
import makeHandleModeration from './handle-moderation'
import makeCommentsDb from '../data-access/comments-db'
import makeFakeComment from '../../__test__/fixtures/comment'
import makeDb from '../../__test__/fixtures/db'

describe('add comment', () => {
  let commentsDb
  beforeAll(() => {
    commentsDb = makeCommentsDb({ makeDb })
  })

  it('inserts comments in the database', async () => {
    const newComment = makeFakeComment()
    const handleModeration = makeHandleModeration({
      isQuestionable: () => !newComment.published,
      initiateReview: () => {}
    })
    const addComment = makeAddComment({
      commentsDb,
      handleModeration
    })
    const inserted = await addComment(newComment)
    expect(inserted).toMatchObject(newComment)
  })
  it('does not publish questionable comments', async () => {
    const handleModeration = makeHandleModeration({
      isQuestionable: () => true,
      initiateReview: () => {}
    })
    const addComment = makeAddComment({
      commentsDb,
      handleModeration
    })
    const inappropriate = makeFakeComment({ text: 'What is this #!@*' })
    const inserted = await addComment(inappropriate)
    expect(inserted.published).toBe(false)
  })
  it('publishes safe comments', async () => {
    const handleModeration = makeHandleModeration({
      isQuestionable: () => false,
      initiateReview: () => {}
    })
    const addComment = makeAddComment({
      commentsDb,
      handleModeration
    })
    const appropriare = makeFakeComment({ text: 'What a lovely post' })
    const inserted = await addComment(appropriare)
    expect(inserted.published).toBe(true)
  })
  it('is idempotent', async () => {
    const handleModeration = makeHandleModeration({
      isQuestionable: () => false,
      initiateReview: () => {}
    })
    const addComment = makeAddComment({
      commentsDb,
      handleModeration
    })
    const newComment = makeFakeComment({ id: undefined })
    const insertOne = await addComment(newComment)
    const insertTwo = await addComment(newComment)
    expect(insertOne.id).toBeDefined()
    expect(insertOne.id).toBe(insertTwo.id)
  })
})
