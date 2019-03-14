import makeComment from '../comment'
export default function makeAddComment ({ commentsDb, isQuestionable }) {
  return async function addComment (commentInfo) {
    const comment = makeComment(commentInfo)

    const shouldModerate = await isQuestionable(comment.getText())
    if (shouldModerate) {
      comment.unPublish()
    } else {
      comment.publish()
    }

    return commentsDb.insert({
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
