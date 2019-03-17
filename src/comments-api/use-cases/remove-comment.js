import makeComment from '../entities/comment'
export default function makeRemoveComment ({ commentsDb }) {
  return async function removeComment ({ id } = {}) {
    if (!id) {
      throw new Error('You must supply a comment id.')
    }
    const found = await commentsDb.findById({ id })
    let deletedCount = 0
    if (!found) {
      return {
        deletedCount,
        softDelete: false,
        message: 'Comment not found, nothing to delete.'
      }
    }

    const replies = await commentsDb.findReplies({ commentId: found.id })
    const hasReplies = replies.length > 0
    const isReply = !!found.replyToId

    if (hasReplies) {
      const toDelete = makeComment(found)
      toDelete.markDeleted()
      await commentsDb.update({
        id: toDelete.getId(),
        author: toDelete.getAuthor(),
        text: toDelete.getText(),
        replyToId: toDelete.getReplyToId(),
        postId: toDelete.getPostId()
      })
      return {
        deletedCount: deletedCount + 1,
        softDelete: true,
        message: 'Comment has replies. Soft deleted.'
      }
    }

    let parentRemoved = 0
    if (isReply) {
      const parent = await commentsDb.findById({
        id: found.replyToId
      })
      if (parent && makeComment(parent).isDeleted()) {
        const parentReplies = await commentsDb.findReplies({
          commentId: parent.id
        })
        if (parentReplies.length === 1) {
          parentRemoved = await commentsDb.remove(parent)
          deletedCount += parentRemoved
        }
      }
    }

    const removed = await commentsDb.remove({ id })
    return {
      deletedCount: deletedCount + removed,
      softDelete: false,
      message: parentRemoved
        ? 'Comment and parent deleted.'
        : 'Comment deleted.'
    }
  }
}
