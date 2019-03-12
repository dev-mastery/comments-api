import makeComment from '../comment'
export default function makeUpsertComment ({ commentsDb, isQuestionable }) {
  return async function upsertComment ({ commentInfo, action }) {
    const comment = makeComment(commentInfo)

    const shouldModerate = await isQuestionable(comment.contents)
    if (shouldModerate) {
      comment.unPublish()
    } else {
      comment.publish()
    }

    const dbCommand = commentsDb[action]
    return dbCommand({
      id: comment.id,
      author: comment.author,
      contents: comment.contents,
      created: comment.created,
      modified: comment.modified,
      inReplyToCommentId: comment.inReplyToCommentId,
      published: comment.isPublished(),
      onPostId: comment.onPostId
    })
  }
}
