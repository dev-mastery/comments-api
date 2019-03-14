import makeAddComment from './add-comment'
import makeCommentsDb from '../db/comments-db'
import makeFakeComment from '../../../__test__/fixtures/comment'
import makeDb from '../../../__test__/fixtures/db'

describe('add comment', () => {
  let commentsDb
  beforeAll(() => {
    commentsDb = makeCommentsDb({ makeDb })
  })

  it('inserts comments in the database', async () => {
    const newComment = makeFakeComment()
    const addComment = makeAddComment({
      commentsDb,
      isQuestionable: () => !newComment.published
    })
    const inserted = await addComment(newComment)
    expect(inserted).toMatchObject(newComment)
  })
  it('does not publish questionable comments', async () => {
    const addComment = makeAddComment({
      commentsDb,
      isQuestionable: () => true
    })
    const inappropriate = makeFakeComment({ text: 'What is this #!@*' })
    const inserted = await addComment(inappropriate)
    expect(inserted.published).toBe(false)
  })
  it('publishes safe comments', async () => {
    const addComment = makeAddComment({
      commentsDb,
      isQuestionable: () => false
    })
    const appropriare = makeFakeComment({ text: 'What a lovely post' })
    const inserted = await addComment(appropriare)
    expect(inserted.published).toBe(true)
  })
  it('is idempotent', async () => {
    const addComment = makeAddComment({
      commentsDb,
      isQuestionable: () => false
    })
    const newComment = makeFakeComment({ id: undefined })
    const insertOne = await addComment(newComment)
    const insertTwo = await addComment(newComment)
    expect(insertOne.id).toBeDefined()
    expect(insertOne.id).toBe(insertTwo.id)
  })
})
