import makeFakeComment from '../../__test__/fixtures/comment'
import makeComment from './'
describe('comment', () => {
  it('must have an author', () => {
    const comment = makeFakeComment({ author: null })
    expect(() => makeComment(comment)).toThrow('Comment must have an author.')
  })

  it('must have a valid post id', () => {
    const comment = makeFakeComment({ postId: null })
    expect(() => makeComment(comment)).toThrow('Comment must contain a postId.')
  })
  it('must have valid text', () => {
    const comment = makeFakeComment({ text: null })
    expect(() => makeComment(comment)).toThrow(
      'Comment must include at least one character of text.'
    )
  })
  it('can be in reply to another comment', () => {
    const comment = makeFakeComment({ replyToId: 'invalid' })
    expect(() => makeComment(comment)).toThrow(
      'If supplied. Comment must contain a valid replyToId.'
    )
    const notInReply = makeFakeComment({ replyToId: undefined })
    expect(() => makeComment(notInReply)).not.toThrow()
  })
  it('can have an id', () => {
    const comment = makeFakeComment({ id: 'invalid' })
    expect(() => makeComment(comment)).toThrow('Comment must have a valid id.')
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
  it('is createdOn now in UTC', () => {
    const noCreationDate = makeFakeComment({ createdOn: undefined })
    expect(noCreationDate.createdOn).not.toBeDefined()
    const d = makeComment(noCreationDate).getCreatedOn()
    expect(d).toBeDefined()
    expect(new Date(d).toUTCString().substring(26)).toBe('GMT')
  })
  it('is modifiedOn now in UTC', () => {
    const noModifiedOnDate = makeFakeComment({ modifiedOn: undefined })
    expect(noModifiedOnDate.modifiedOn).not.toBeDefined()
    const d = makeComment(noModifiedOnDate).getCreatedOn()
    expect(d).toBeDefined()
    expect(new Date(d).toUTCString().substring(26)).toBe('GMT')
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
  it('includes a hash', () => {
    const fakeComment = {
      author: 'Bruce Wayne',
      text: "I'm batman.",
      postId: 'cjt65art5350vy000hm1rp3s9',
      published: true,
      source: { ip: '127.0.0.1' }
    }
    // md5 from: http://www.miraclesalad.com/webtools/md5.php
    expect(makeComment(fakeComment).getHash()).toBe(
      '7bb94f070d9305976b5381b7d3e8ad8a'
    )
  })
  it('must have a source', () => {
    const noSource = makeFakeComment({ source: undefined })
    expect(() => makeComment(noSource)).toThrow('Comment must have a source.')
  })
  it('must have a source ip', () => {
    const noIp = makeFakeComment({ source: { ip: undefined } })
    expect(() => makeComment(noIp)).toThrow(
      'Comment source must contain an IP.'
    )
  })
  it('can have a source browser', () => {
    const withBrowser = makeFakeComment()
    expect(
      makeComment(withBrowser)
        .getSource()
        .getBrowser()
    ).toBe(withBrowser.source.browser)
  })
  it('can have a source referrer', () => {
    const withRef = makeFakeComment()
    expect(
      makeComment(withRef)
        .getSource()
        .getReferrer()
    ).toBe(withRef.source.referrer)
  })
})
