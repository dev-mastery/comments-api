export default function makePatchComment ({ editComment }) {
  return async function patchComment (httpRequest) {
    try {
      const { source = {}, ...commentInfo } = httpRequest.body
      source.ip = httpRequest.ip
      const toEdit = {
        ...commentInfo,
        source,
        id: httpRequest.params.id
      }
      const patched = await editComment(toEdit)
      return {
        headers: {
          'Content-Type': 'application/json',
          'Last-Modified': new Date(patched.modifiedOn).toUTCString()
        },
        statusCode: 200,
        body: { patched }
      }
    } catch (e) {
      // TODO: Error logging
      if (process.env.NODE_ENV !== 'test') {
        console.log(e)
      }
      if (e.name === 'RangeError') {
        return {
          headers: {
            'Content-Type': 'application/json'
          },
          statusCode: 404,
          body: {
            error: e.message
          }
        }
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
