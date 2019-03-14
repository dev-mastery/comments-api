import makeUpsertComment from './upsert-comment'
import makeCommentsDb from '../db/comments-db'
import makeFakeComment from '../../../__test__/fixtures/comment'
import makeDb, { closeDb, clearDb } from '../../../__test__/fixtures/db'

describe('modify comment', () => {
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
  it('inserts and updates comments in the database', async () => {
    expect.assertions(2)
    const newComment = makeFakeComment()
    const upsertComment = makeUpsertComment({
      commentsDb,
      isQuestionable: () => !newComment.published
    })
    const inserted = await upsertComment({
      commentInfo: newComment,
      action: 'insert'
    })
    expect(inserted).toMatchObject(newComment)

    const modifiedComment = makeFakeComment({
      id: newComment.id,
      published: newComment.published
    })
    const updated = await upsertComment({
      commentInfo: modifiedComment,
      action: 'update'
    })
    expect(updated).toMatchObject(modifiedComment)
  })
  it('does not publish questionable comments', async () => {
    const upsertComment = makeUpsertComment({
      commentsDb,
      isQuestionable: () => true
    })
    const inappropriate = makeFakeComment({ text: 'What is this #!@*' })
    const inserted = await upsertComment({
      commentInfo: inappropriate,
      action: 'insert'
    })
    expect(inserted.published).toBe(false)
  })
  it('publishes safe comments', async () => {
    const upsertComment = makeUpsertComment({
      commentsDb,
      isQuestionable: () => false
    })
    const appropriare = makeFakeComment({ text: 'What a lovely post' })
    const inserted = await upsertComment({
      commentInfo: appropriare,
      action: 'insert'
    })
    expect(inserted.published).toBe(true)
  })
})
