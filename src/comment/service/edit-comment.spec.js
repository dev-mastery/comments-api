import makeEditComment from './edit-comment'
import makeFakeComment from '../../../__test__/fixtures/comment'
import makeCommentsDb from '../db/comments-db'
import makeDb from '../../../__test__/fixtures/db'

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
      isQuestionable: () => {
        throw new Error('isQuestionable should not have been called')
      }
    })
    const commentToEdit = makeFakeComment({ id: undefined })
    expect(editComment(commentToEdit)).rejects.toThrow('You must supply an id.')
  })
  it('modifies a comment', async () => {
    const editComment = makeEditComment({
      commentsDb,
      isQuestionable: () => false
    })
    const fakeComment = makeFakeComment({
      modified: undefined
    })
    const inserted = await commentsDb.insert(fakeComment)
    const edited = await editComment({ ...fakeComment, text: 'changed' })
    expect(edited.text).toBe('changed')
    expect(inserted.modified).not.toBe(edited.modified)
    expect(edited.hash).toBeDefined()
    expect(inserted.hash).not.toBe(edited.hash)
  })
})
