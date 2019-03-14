import makeComment from '../comment'
export default function makeUpsertComment ({ commentsDb, isQuestionable }) {
  return async function upsertComment ({ commentInfo, action }) {
    const comment = makeComment(commentInfo)

    const shouldModerate = await isQuestionable(comment.getText())
    if (shouldModerate) {
      comment.unPublish()
    } else {
      comment.publish()
    }

    const dbCommand = commentsDb[action]
    return dbCommand({
      id: comment.getId(),
      author: comment.getAuthor(),
      text: comment.getText(),
      created: comment.getCreated(),
      modified: comment.getModified(),
      replyToId: comment.getReplyToId(),
      published: comment.isPublished(),
      postId: comment.getPostId()
    })
  }
}
