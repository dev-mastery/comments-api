export default function makePostComment ({ addComment }) {
  return async function postComment (httpRequest) {
    const headers = {
      'Content-Type': 'application/json'
    }
    try {
      const posted = await addComment(httpRequest.body)
      return {
        headers,
        statusCode: 201,
        body: { posted }
      }
    } catch (e) {
      console.log(e)
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
