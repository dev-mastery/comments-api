import sanitize from '../../utils/sanitize'
import md5 from '../../utils/md5'
import Id from '../../utils/id'
import makeSource from './source'

export default function makeComment ({
  author,
  createdOn,
  id,
  source,
  modifiedOn,
  postId,
  published = false,
  replyToId,
  text
} = {}) {
  validateId(id)
  validateAuthor(author)
  validatePostId(postId)
  validateText(text)
  validateSource(source)
  validateReplyToId(replyToId)
  const deletedText = '.xX This comment has been deleted Xx.'
  let sanitizedText = sanitizeText(text)
  const hash = md5(
    sanitizedText +
      published +
      (author || '') +
      (postId || '') +
      (replyToId || '')
  )
  const validSource = makeSource(source)
  return Object.freeze({
    getAuthor: () => author,
    getCreatedOn: () => createdOn || Date.now(),
    getHash: () => hash,
    getId: () => id || Id.makeId(),
    getModifiedOn: () => modifiedOn || Date.now(),
    getPostId: () => postId,
    getReplyToId: () => replyToId,
    getSource: () => validSource,
    getText: () => sanitizedText,
    isDeleted: () => sanitizedText === deletedText,
    isPublished: () => published,
    markDeleted: () => {
      sanitizedText = deletedText
      author = 'deleted'
    },
    publish: () => (published = true),
    unPublish: () => (published = false)
  })

  function validateId (id) {
    if (id && !Id.isValidId(id)) {
      throw new Error('Invalid id.')
    }
  }

  function validateSource (source) {
    if (!source) {
      throw new Error('Comment must have a source.')
    }
  }

  function validateAuthor (author) {
    if (!author) {
      throw new Error('Comment must have an author.')
    }
    if (author.length < 2) {
      throw new Error("Comment author's name must be longer than 2 characters.")
    }
  }

  function validatePostId (postId) {
    if (!postId) {
      throw new Error('Comment must contain an "postId".')
    }
  }

  function validateText (text) {
    if (!text || text.length < 2) {
      throw new Error(
        'Comment must contain a "text" property that is at least 2 characters long.'
      )
    }
  }

  function validateReplyToId (replyToId) {
    if (replyToId && !Id.isValidId(replyToId)) {
      throw new Error(
        'If supplied. Comment must contain a "replyToId" property that is a valid cuid.'
      )
    }
  }

  function sanitizeText (text) {
    const sanitized = sanitize(text)
    if (sanitized.length < 2) {
      throw new Error('Comment contains no usable text.')
    }
    return sanitized
  }
}
