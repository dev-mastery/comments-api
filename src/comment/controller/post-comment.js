export default function makePostComment ({ addComment }) {
  return async function postComment (httpRequest) {
    try {
      const posted = await addComment(httpRequest.body)
      return {
        headers: {
          'Content-Type': 'application/json',
          'Last-Modified': new Date(posted.modifiedOn).toUTCString()
        },
        statusCode: 201,
        body: { posted }
      }
    } catch (e) {
      // TODO: Error logging
      if (process.env.NODE_ENV !== 'test') {
        console.log(e)
      }

      return {
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 400,
        body: {
          error: e.message
        }
      }
    }
  }
}
