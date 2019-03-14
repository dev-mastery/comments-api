import makeFakeComment from '../../__test__/fixtures/comment'
import makeComment from './comment'
describe('comment', () => {
  it('must have either an id or an author', () => {
    expect.assertions(2)
    const comment = makeFakeComment({ id: undefined, author: null })
    expect(() => makeComment(comment)).toThrow(
      'Comment must contain an "author" property that is at least 2 characters long.'
    )
    const valid = makeFakeComment({ author: null })
    expect(() => makeComment(valid)).not.toThrow()
  })

  it('must have either an id or a valid post id', () => {
    expect.assertions(2)
    const comment = makeFakeComment({ id: undefined, postId: null })
    expect(() => makeComment(comment)).toThrow(
      'Comment must contain an "postId".'
    )
    const valid = makeFakeComment({ postId: null })
    expect(() => makeComment(valid)).not.toThrow()
  })

  it('must have valid text', () => {
    const comment = makeFakeComment({ text: null })
    expect(() => makeComment(comment)).toThrow(
      'Comment must contain a "text" property that is at least 2 characters long.'
    )
  })
  it('can be in reply to another comment', () => {
    const comment = makeFakeComment({ replyToId: 'invalid' })
    expect(() => makeComment(comment)).toThrow(
      'If supplied. Comment must contain an "replyToId" property that is a valid cuid.'
    )
    const notInReply = makeFakeComment({ replyToId: undefined })
    expect(() => makeComment(notInReply)).not.toThrow()
  })
  it('can have an id', () => {
    const comment = makeFakeComment({ id: 'invalid' })
    expect(() => makeComment(comment)).toThrow('Invalid id.')
    const noId = makeFakeComment({ id: undefined })
    expect(() => makeComment(noId)).not.toThrow()
  })
  it('can create an id', () => {
    const noId = makeFakeComment({ id: undefined })
    const comment = makeComment(noId)
    expect(comment.getId()).toBeDefined()
  })
  it('can be published', () => {
    const unpublished = makeFakeComment({ published: false })
    const comment = makeComment(unpublished)
    expect(comment.isPublished()).toBe(false)
    comment.publish()
    expect(comment.isPublished()).toBe(true)
  })
  it('can be unpublished', () => {
    const unpublished = makeFakeComment({ published: true })
    const comment = makeComment(unpublished)
    expect(comment.isPublished()).toBe(true)
    comment.unPublish()
    expect(comment.isPublished()).toBe(false)
  })
  it('is created now', () => {
    const noCreationDate = makeFakeComment({ created: undefined })
    expect(noCreationDate.created).not.toBeDefined()
    expect(makeComment(noCreationDate).getCreated()).toBeDefined()
  })
  it('is modified now', () => {
    const noModifiedDate = makeFakeComment({ modified: undefined })
    expect(noModifiedDate.modified).not.toBeDefined()
    expect(makeComment(noModifiedDate).getModified()).toBeDefined()
  })
  it('sanitizes its text', () => {
    const sane = makeComment({
      ...makeFakeComment({ text: '<p>This is fine</p>' })
    })
    const insane = makeComment({
      ...makeFakeComment({
        text: '<script>This is not so fine</script><p>but this is ok</p>'
      })
    })
    const totallyInsane = makeFakeComment({
      text: '<script>All your base are belong to us!</script>'
    })

    expect(sane.getText()).toBe('<p>This is fine</p>')
    expect(insane.getText()).toBe('<p>but this is ok</p>')
    expect(() => makeComment(totallyInsane)).toThrow(
      'Comment contains no usable text.'
    )
  })
  it('can be marked deleted', () => {
    const fake = makeFakeComment()
    const c = makeComment(fake)
    c.markDeleted()
    expect(c.isDeleted()).toBe(true)
    expect(c.getText()).toBe('.xX This comment has been deleted Xx.')
    expect(c.getAuthor()).toBe('deleted')
  })
})
