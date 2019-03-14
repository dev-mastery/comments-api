import makeComment from '../comment'
export default function makeEditComment ({ commentsDb, isQuestionable }) {
  return async function editComment (commentInfo) {
    if (!commentInfo.id) {
      throw new Error('You must supply an id.')
    }
    if (!commentInfo.text) {
      throw new Error('You must supply text.')
    }
    const comment = makeComment(commentInfo)

    const shouldModerate = await isQuestionable(comment.getText())
    if (shouldModerate) {
      comment.unPublish()
    } else {
      comment.publish()
    }

    return commentsDb.update({
      id: comment.getId(),
      published: comment.isPublished(),
      modified: comment.getModified(),
      text: comment.getText()
    })
  }
}
