import sanitize from 'sanitize-html'
import Id from '../helpers/id'

export default makeComment

function makeComment ({
  author,
  created,
  id,
  modified,
  postId,
  published = false,
  replyToId,
  text
}) {
  if (id && !Id.isValidId(id)) {
    throw new Error('Invalid id.')
  }

  if (!id && (!author || author.length < 2)) {
    throw new Error(
      'Comment must contain an "author" property that is at least 2 characters long.'
    )
  }

  if (!id && !postId) {
    throw new Error('Comment must contain an "postId".')
  }

  if (!text || text.length < 2) {
    throw new Error(
      'Comment must contain a "text" property that is at least 2 characters long.'
    )
  }

  if (replyToId && !Id.isValidId(replyToId)) {
    throw new Error(
      'If supplied. Comment must contain an "replyToId" property that is a valid cuid.'
    )
  }

  let sanitizedText = sanitize(text)
  if (sanitizedText.length < 2) {
    throw new Error('Comment contains no usable text.')
  }

  const deletedText = '.xX This comment has been deleted Xx.'
  function markDeleted () {
    sanitizedText = deletedText
    author = 'deleted'
  }

  return Object.freeze({
    getAuthor: () => author,
    getCreated: () => created || new Date().toJSON(),
    getId: () => id || Id.makeId(),
    getModified: () => modified || new Date().toJSON(),
    getPostId: () => postId,
    getReplyToId: () => replyToId,
    getText: () => sanitizedText,
    isDeleted: () => sanitizedText === deletedText,
    isPublished: () => published,
    markDeleted,
    publish: () => (published = true),
    unPublish: () => (published = false)
  })
}
