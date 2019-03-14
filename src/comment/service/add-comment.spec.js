import makeAddComment from './add-comment'
import makeCommentsDb from '../db/comments-db'
import makeFakeComment from '../../../__test__/fixtures/comment'
import makeDb, { closeDb, clearDb } from '../../../__test__/fixtures/db'

describe('add comment', () => {
  let commentsDb
  beforeEach(() => {
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
})
