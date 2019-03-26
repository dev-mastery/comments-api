import makePostComment from './post-comment'
import makeFakeComment from '../../__test__/fixtures/comment'

describe('post comment controller', () => {
  it('successfully posts a comment', async () => {
    const postComment = makePostComment({ addComment: c => c })
    const comment = makeFakeComment()
    const request = {
      headers: {
        'Content-Type': 'application/json',
        Referer: comment.source.referrer,
        'User-Agent': comment.source.browser
      },
      body: comment,
      ip: comment.source.ip
    }
    const expected = {
      headers: {
        'Content-Type': 'application/json',
        'Last-Modified': new Date(request.body.modifiedOn).toUTCString()
      },
      statusCode: 201,
      body: { posted: request.body }
    }
    const actual = await postComment(request)
    expect(actual).toEqual(expected)
  })
  it('reports user errors', async () => {
    const postComment = makePostComment({
      addComment: () => {
        throw Error('Pow!')
      }
    })
    const fakeComment = makeFakeComment()
    const request = {
      headers: {
        'Content-Type': 'application/json',
        Referer: fakeComment.source.referrer,
        'User-Agent': fakeComment.source.browser
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
    const actual = await postComment(request)
    expect(actual).toEqual(expected)
  })
})
