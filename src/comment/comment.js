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
  published = false,
  replies = []
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
  id = id || Id.makeId()

  function publish () {
    published = true
  }

  function unPublish () {
    published = false
  }

  function isPublished () {
    return published
  }

  function getReplies () {
    return Object.freeze(replies)
  }

  function addReplies (repliesToAdd) {
    replies.concat(repliesToAdd)
  }
  created = created || new Date().toJSON()
  modified = modified || new Date().toJSON()

  return Object.freeze({
    addReplies,
    author,
    contents,
    created,
    getReplies,
    id,
    inReplyToCommentId,
    modified,
    onPostId,
    isPublished,
    publish,
    unPublish
  })
}
