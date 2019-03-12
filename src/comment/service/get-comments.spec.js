import makeGetComments from './get-comments'
import makeCommentsDb from '../db/comments-db'
import makeFakeComment from '../../../__test__/fixtures/comment'
import makeDb, { closeDb, clearDb } from '../../../__test__/fixtures/db'

describe('get comments', () => {
  let commentsDb, getComments
  beforeAll(() => {
    commentsDb = makeCommentsDb({ makeDb })
    getComments = makeGetComments({ commentsDb })
  })
  it('requires a post id', () => {
    expect(getComments()).rejects.toThrow('You must supply a post id.')
  })
  it.todo('gets top-level comments')
})
