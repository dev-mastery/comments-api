import makeEditComment from './edit-comment'
import makeFakeComment from '../../../__test__/fixtures/comment'
// import makeCommentsDb from '../db/comments-db'
// import makeDb, { closeDb, clearDb } from '../../../__test__/fixtures/db'

describe('edit comment', () => {
  // let commentsDb
  // beforeEach(() => {
  //   commentsDb = makeCommentsDb({ makeDb })
  // })
  // afterEach(async () => {
  //   await clearDb()
  //   return true
  // })
  // afterAll(async () => {
  //   await closeDb()
  //   return true
  // })
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
  it.todo('modifies a comment')
})
