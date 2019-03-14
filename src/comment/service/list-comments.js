export default function makeListComments ({ commentsDb }) {
  return async function listComments ({ postId } = {}) {
    if (!postId) {
      throw new Error('You must supply a post id.')
    }
    const topLevel = await commentsDb.findByPostId({
      postId,
      omitReplies: false
    })
    const comments = await nest(topLevel)
    return comments

    async function nest (replies) {
      if (replies.length === 0) {
        return replies
      }
      return replies.reduce((nested, comment) => {
        comment.replies = replies.filter(
          reply => reply.replyToId === comment.id
        )
        nest(comment.replies)
        if (comment.replyToId == null) {
          nested.push(comment)
        }
        return nested
      }, [])
    }
  }
}
