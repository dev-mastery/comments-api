import pReduce from 'p-reduce'
export default function makeListComments ({ commentsDb }) {
  return async function listComments ({ postId } = {}) {
    if (!postId) {
      throw new Error('You must supply a post id.')
    }
    const topLevel = await commentsDb.findByPostId({ postId })
    const comments = await pReduce(
      topLevel,
      async (graph, comment) => {
        comment.replies = await commentsDb.findReplies({
          commentId: comment.id
        })
        await nest(comment.replies)
        graph.push(comment)
        return graph
      },
      []
    )
    return comments

    async function nest (replies) {
      if (replies.length === 0) {
        return replies
      }
      const commentGraph = await pReduce(
        replies,
        async (graph, comment) => {
          comment.replies = await commentsDb.findReplies({
            commentId: comment.id
          })
          await nest(comment.replies)
          graph.push(comment)
          return graph
        },
        []
      )
      return commentGraph
    }
  }
}
