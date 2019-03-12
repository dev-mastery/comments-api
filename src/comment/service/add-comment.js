export default function makeAddComment ({ upsertComment }) {
  return async function addComment (commentInfo) {
    return upsertComment({
      commentInfo,
      action: 'insert'
    })
  }
}
