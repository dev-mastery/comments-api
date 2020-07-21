import makeComment from '../comment'
export default function makeEditComment ({ commentsDb, handleModeration }) {
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
    const comment = makeComment({ ...existing, ...changes, modifiedOn: null })
    if (comment.getHash() === existing.hash) {
      return existing
    }
    const moderated = await handleModeration({ comment })
    const updated = await commentsDb.update({
      id: moderated.getId(),
      published: moderated.isPublished(),
      modifiedOn: moderated.getModifiedOn(),
      text: moderated.getText(),
      hash: moderated.getHash()
    })
    return { ...existing, ...updated }
  }
}
