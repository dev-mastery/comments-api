import makeComment from '../comment'

export default function makeRemoveComment ({ commentsDb }) {
  return async function removeComment ({ id } = {}) {
    if (!id) {
      throw new Error('You must supply a comment id.')
    }

    const commentToDelete = await commentsDb.findById({ id })

    if (!commentToDelete) {
      return deleteNothing()
    }

    if (await hasReplies(commentToDelete)) {
      return softDelete(commentToDelete)
    }

    if (await isOnlyReplyOfDeletedParent(commentToDelete)) {
      return deleteCommentAndParent(commentToDelete)
    }

    return hardDelete(commentToDelete)
  }

  async function hasReplies ({ id: commentId }) {
    const replies = await commentsDb.findReplies({
      commentId,
      publishedOnly: false
    })
    return replies.length > 0
  }

  async function isOnlyReplyOfDeletedParent (comment) {
    if (!comment.replyToId) {
      return false
    }
    const parent = await commentsDb.findById({ id: comment.replyToId })
    if (parent && makeComment(parent).isDeleted()) {
      const replies = await commentsDb.findReplies({
        commentId: parent.id,
        publishedOnly: false
      })
      return replies.length === 1
    }
    return false
  }

  function deleteNothing () {
    return {
      deletedCount: 0,
      softDelete: false,
      message: 'Comment not found, nothing to delete.'
    }
  }

  async function softDelete (commentInfo) {
    const toDelete = makeComment(commentInfo)
    toDelete.markDeleted()
    await commentsDb.update({
      id: toDelete.getId(),
      author: toDelete.getAuthor(),
      text: toDelete.getText(),
      replyToId: toDelete.getReplyToId(),
      postId: toDelete.getPostId()
    })
    return {
      deletedCount: 1,
      softDelete: true,
      message: 'Comment has replies. Soft deleted.'
    }
  }

  async function deleteCommentAndParent (comment) {
    await Promise.all([
      commentsDb.remove(comment),
      commentsDb.remove({ id: comment.replyToId })
    ])
    return {
      deletedCount: 2,
      softDelete: false,
      message: 'Comment and parent deleted.'
    }
  }

  async function hardDelete (comment) {
    await commentsDb.remove(comment)
    return {
      deletedCount: 1,
      softDelete: false,
      message: 'Comment deleted.'
    }
  }
}
