import makeEditComment from './edit-comment'
import makeFakeComment from '../../__test__/fixtures/comment'
import makeHandleModeration from './handle-moderation'
import makeCommentsDb from '../data-access/comments-db'
import makeDb from '../../__test__/fixtures/db'

describe('edit comment', () => {
  let commentsDb
  beforeAll(() => {
    commentsDb = makeCommentsDb({ makeDb })
  })
  it('must include an id', () => {
    const editComment = makeEditComment({
      commentsDb: {
        update: () => {
          throw new Error('update should not have been called')
        }
      },
      isQuestionable: () => {
        throw new Error('isQuestionable should not have been called')
      }
    })
    const commentToEdit = makeFakeComment({ id: undefined })
    expect(editComment(commentToEdit)).rejects.toThrow('You must supply an id.')
  })
  it('must include text', () => {
    const editComment = makeEditComment({
      commentsDb: {
        update: () => {
          throw new Error('update should not have been called')
        }
      },
      handleModeration: () => {}
    })
    const commentToEdit = makeFakeComment({ id: undefined })
    expect(editComment(commentToEdit)).rejects.toThrow('You must supply an id.')
  })
  it('modifies a comment', async () => {
    const handleModeration = makeHandleModeration({
      isQuestionable: () => false,
      initiateReview: () => {}
    })
    const editComment = makeEditComment({
      commentsDb,
      handleModeration
    })
    const fakeComment = makeFakeComment({
      modifiedOn: undefined
    })
    const inserted = await commentsDb.insert(fakeComment)
    const edited = await editComment({ ...fakeComment, text: 'changed' })
    expect(edited.text).toBe('changed')
    expect(inserted.modifiedOn).not.toBe(edited.modifiedOn)
    expect(edited.hash).toBeDefined()
    expect(inserted.hash).not.toBe(edited.hash)
  })
  it('does not publish questionable comments', async () => {
    const inserted = await commentsDb.insert(
      makeFakeComment({ published: true })
    )
    expect(inserted.published).toBe(true)
    const handleModeration = makeHandleModeration({
      isQuestionable: () => true,
      initiateReview: () => {}
    })
    const editComment = makeEditComment({
      commentsDb,
      handleModeration
    })
    inserted.text = 'What is this #!@*'
    const edited = await editComment(inserted)
    expect(edited.published).toBe(false)
    return commentsDb.remove(inserted)
  })
})
