import makeAddComment from './add-comment'
import makeEditComment from './edit-comment'
import makeRemoveComment from './remove-comment'
import makeListComments from './list-comments'
import commentsDb from '../data-access'
import isQuestionable from '../adapters/is-questionable'

const addComment = makeAddComment({ commentsDb, isQuestionable })
const editComment = makeEditComment({ commentsDb, isQuestionable })
const listComments = makeListComments({ commentsDb })
const removeComment = makeRemoveComment({ commentsDb })

const commentService = Object.freeze({
  addComment,
  editComment,
  listComments,
  removeComment
})

export default commentService
export { addComment, editComment, listComments, removeComment }
