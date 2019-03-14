export default function makePatchComment ({ editComment }) {
  return async function patchComment (httpRequest) {
    const headers = {
      'Content-Type': 'application/json'
    }
    try {
      const commentInfo = { ...httpRequest.body, id: httpRequest.params.id }
      const patch = await editComment(commentInfo)
      return {
        headers,
        statusCode: patch == null ? 404 : 200,
        body: { patch } || { error: 'Comment not found.' }
      }
    } catch (e) {
      if (e.name === 'RangeError') {
        return {
          headers,
          statusCode: 404,
          body: {
            error: e.message
          }
        }
      }
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
