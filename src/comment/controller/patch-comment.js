export default function makePatchComment ({ editComment }) {
  return async function patchComment (httpRequest) {
    const headers = {
      'Content-Type': 'application/json'
    }
    try {
      const commentInfo = { ...httpRequest.body, id: httpRequest.params.id }
      const put = await editComment(commentInfo)
      return {
        headers,
        statusCode: put == null ? 404 : 200,
        body: { put } || { error: 'Comment not found.' }
      }
    } catch (e) {
      return {
        headers,
        statusCode: 400,
        body: {
          error: e.message
        }
      }
    }
  }
}
