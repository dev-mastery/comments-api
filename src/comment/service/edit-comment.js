import makeComment from '../comment'
export default function makeEditComment ({ commentsDb, isQuestionable }) {
  return async function editComment ({ id, ...changes } = {}) {
    if (!id) {
      throw new Error('You must supply an id.')
    }
    if (!changes.text) {
      throw new Error('You must supply text.')
    }
    const existing = await commentsDb.findById({ id })

    if (!existing) {
      throw new RangeError('Comment not found.')
    }
    const comment = makeComment({ ...existing, ...changes })

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
      text: comment.getText(),
      hash: comment.getHash()
    })
  }
}
