import makePostComment from './post-comment'
import makeFakeComment from '../../../__test__/fixtures/comment'

describe('post comment controller', () => {
  it('successfully posts a comment', async () => {
    const postComment = makePostComment({ addComment: c => c })
    const comment = makeFakeComment()
    const request = {
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
    const request = {
      body: makeFakeComment()
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
