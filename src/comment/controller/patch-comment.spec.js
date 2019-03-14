import makePatchComment from './patch-comment'
import makeFakeComment from '../../../__test__/fixtures/comment'

describe('put comment controller', () => {
  it('successfully puts a comment', async () => {
    const fakeComment = makeFakeComment()
    const patchComment = makePatchComment({ editComment: c => c })
    const request = {
      params: {
        id: fakeComment.id
      },
      body: fakeComment
    }
    const expected = {
      headers: {
        'Content-Type': 'application/json'
      },
      statusCode: 200,
      body: { put: request.body }
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
