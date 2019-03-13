import makeFakeComment from '../../__test__/fixtures/comment'
import makeComment from './comment'
describe('comment', () => {
  it('must have an author', () => {
    const comment = makeFakeComment({ author: null })
    expect(() => makeComment(comment)).toThrow(
      'Comment must contain an "author" property that is at least 2 characters long.'
    )
  })
  it('must have valid post id', () => {
    const comment = makeFakeComment({ onPostId: null })
    expect(() => makeComment(comment)).toThrow(
      'Comment must contain an "onPostId".'
    )
  })
  it('must have valid contents', () => {
    const comment = makeFakeComment({ contents: null })
    expect(() => makeComment(comment)).toThrow(
      'Comment must contain a "contents" property that is at least 2 characters long.'
    )
  })
  it('can be in reply to another comment', () => {
    const comment = makeFakeComment({ inReplyToCommentId: 'invalid' })
    expect(() => makeComment(comment)).toThrow(
      'If supplied. Comment must contain an "inReplyToCommentId" property that is a valid cuid.'
    )
    const notInReply = makeFakeComment({ inReplyToCommentId: undefined })
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
    expect(comment.getIsPublished()).toBe(false)
    comment.publish()
    expect(comment.getIsPublished()).toBe(true)
  })
  it('can be unpublished', () => {
    const unpublished = makeFakeComment({ published: true })
    const comment = makeComment(unpublished)
    expect(comment.getIsPublished()).toBe(true)
    comment.unPublish()
    expect(comment.getIsPublished()).toBe(false)
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
  it('sanitizes its contents', () => {
    const sane = makeComment({
      ...makeFakeComment({ contents: '<p>This is fine</p>' })
    })
    const insane = makeComment({
      ...makeFakeComment({
        contents: '<script>This is not so fine</script><p>but this is ok</p>'
      })
    })
    const totallyInsane = makeFakeComment({
      contents: '<script>All your base are belong to us!</script>'
    })

    expect(sane.getContents()).toBe('<p>This is fine</p>')
    expect(insane.getContents()).toBe('<p>but this is ok</p>')
    expect(() => makeComment(totallyInsane)).toThrow(
      'Comment contains no usable content.'
    )
  })
  it('can be marked deleted', () => {
    const fake = makeFakeComment()
    const c = makeComment(fake)
    c.markDeleted()
    expect(c.getContents()).toBe('deleted')
    expect(c.getAuthor()).toBe('deleted')
  })
})
