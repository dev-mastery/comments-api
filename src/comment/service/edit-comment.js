export default function makeEditComment ({ upsertComment }) {
  return async function editComment ({ id, ...commentDetails }) {
    if (!id) {
      throw new Error('Comment must have an id.')
    }
    return upsertComment({
      action: 'update',
      commentInfo: {
        id,
        ...commentDetails
      }
    })
  }
}
