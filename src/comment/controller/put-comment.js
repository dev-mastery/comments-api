export default function makePutComment ({ editComment }) {
  return async function putComment (httpRequest) {
    const headers = {
      'Content-Type': 'application/json'
    }
    try {
      const commentInfo = { ...httpRequest.body, id: httpRequest.params.id }
      const put = await editComment(commentInfo)
      return {
        headers,
        statusCode: 200,
        body: put
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
