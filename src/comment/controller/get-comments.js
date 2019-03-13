export default function makeGetComments ({ listPostComments }) {
  return async function getComments (httpRequest) {
    const headers = {
      'Content-Type': 'application/json'
    }
    try {
      console.log(httpRequest.query.postId)
      const postComments = await listPostComments({
        postId: httpRequest.query.postId
      })
      return {
        headers,
        statusCode: 200,
        body: postComments
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
