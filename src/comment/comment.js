import sanitize from 'sanitize-html'
import crypto from 'crypto'
import Id from '../helpers/id'

export default function makeComment ({
  author,
  createdOn,
  id,
  modifiedOn,
  postId,
  published = false,
  replyToId,
  text
} = {}) {
  validateId(id)
  validateAuthor(id, author)
  validatePostId(id, postId)
  validateText(text)
  validateReplyToId(replyToId)
  const deletedText = '.xX This comment has been deleted Xx.'
  let sanitizedText = sanitizeText(text)
  const hash = crypto
    .createHash('md5')
    .update(
      sanitizedText +
        published +
        (author || '') +
        (postId || '') +
        (replyToId || ''),
      'utf-8'
    )
    .digest('hex')

  return Object.freeze({
    getAuthor: () => author,
    getCreated: () => createdOn || Date.parse(new Date().toUTCString()),
    getHash: () => hash,
    getId: () => id || Id.makeId(),
    getModifiedOn: () => modifiedOn || Date.parse(new Date().toUTCString()),
    getPostId: () => postId,
    getReplyToId: () => replyToId,
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

  function validateAuthor (id, author) {
    if (!id) {
      if (!author) {
        throw new Error('Comment must have an author.')
      }
      // if (!author.displayName) {
      //   throw new Error('Comment author must have a display name.')
      // }
      if (author.length < 2) {
        throw new Error(
          "Comment author's display name must be longer than 2 characters."
        )
      }
    }
  }

  function validatePostId (id, postId) {
    if (!id && !postId) {
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
        'If supplied. Comment must contain an "replyToId" property that is a valid cuid.'
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
