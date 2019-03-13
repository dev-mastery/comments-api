import sanitize from 'sanitize-html'
import Id from '../helpers/id'

export default makeComment

function makeComment ({
  author,
  contents,
  created,
  id,
  inReplyToCommentId,
  modified,
  onPostId,
  published = false
}) {
  if (!author || author.length < 2) {
    throw new Error(
      'Comment must contain an "author" property that is at least 2 characters long.'
    )
  }

  if (!onPostId) {
    throw new Error('Comment must contain an "onPostId".')
  }

  if (!contents || contents.length < 2) {
    throw new Error(
      'Comment must contain a "contents" property that is at least 2 characters long.'
    )
  }

  if (inReplyToCommentId && !Id.isValidId(inReplyToCommentId)) {
    throw new Error(
      'If supplied. Comment must contain an "inReplyToCommentId" property that is a valid cuid.'
    )
  }

  if (id && !Id.isValidId(id)) {
    throw new Error('Invalid id.')
  }

  contents = sanitize(contents)
  if (contents.length < 2) {
    throw new Error('Comment contains no usable content.')
  }

  function markDeleted () {
    contents = 'deleted'
    author = 'deleted'
  }

  return Object.freeze({
    getAuthor: () => author,
    getContents: () => contents,
    getCreated: () => created || new Date().toJSON(),
    getId: () => id || Id.makeId(),
    getInReplyToCommentId: () => inReplyToCommentId,
    getIsPublished: () => published,
    getModified: () => modified || new Date().toJSON(),
    getOnPostId: () => onPostId,
    markDeleted,
    publish: () => (published = true),
    unPublish: () => (published = false)
  })
}
