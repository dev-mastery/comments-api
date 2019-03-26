import makePatchComment from './patch-comment'
import makeFakeComment from '../../__test__/fixtures/comment'

describe('patch comment controller', () => {
  it('successfully patches a comment', async () => {
    const fakeComment = makeFakeComment()
    const patchComment = makePatchComment({ editComment: c => c })
    const request = {
      headers: {
        'Content-Type': 'application/json',
        Referer: fakeComment.source.referrer,
        'User-Agent': fakeComment.source.browser
      },
      params: {
        id: fakeComment.id
      },
      body: fakeComment
    }
    const expected = {
      headers: {
        'Content-Type': 'application/json',
        'Last-Modified': new Date(fakeComment.modifiedOn).toUTCString()
      },
      statusCode: 200,
      body: { patched: request.body }
    }
    const actual = await patchComment(request)
    expect(actual).toEqual(expected)
  })
  it('reports user errors', async () => {
    const fakeComment = makeFakeComment()
    const patchComment = makePatchComment({
      editComment: () => {
        throw Error('Pow!')
      }
    })
    const request = {
      headers: {
        'Content-Type': 'application/json',
        Referer: fakeComment.source.referrer,
        'User-Agent': fakeComment.source.browser
      },
      params: {
        id: fakeComment.id
      },
      body: fakeComment
    }
    const expected = {
      headers: {
        'Content-Type': 'application/json'
      },
      statusCode: 400,
      body: { error: 'Pow!' }
    }
    const actual = await patchComment(request)
    expect(actual).toEqual(expected)
  })
})
