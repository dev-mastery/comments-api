import makeEditComment from './edit-comment'
import makeFakeComment from '../../../__test__/fixtures/comment'

describe('edit comment', () => {
  it('must include an id', () => {
    const editComment = makeEditComment({
      upsertComment: () => {
        throw new Error('upsertComment should not have been called!')
      }
    })
    const commentToEdit = makeFakeComment({ id: undefined })
    expect(editComment(commentToEdit)).rejects.toThrow(
      'Comment must have an id.'
    )
  })
  it.todo('modifies a comment')
})
