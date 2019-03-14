// import makeUpsertComment from './upsert-comment'
import makeAddComment from './add-comment'
import makeEditComment from './edit-comment'
import makeRemoveComment from './remove-comment'
import makeListPostComments from './list-post-comments'
import commentsDb from '../db'
import isQuestionable from '../../helpers/is-questionable'

// const upsertComment = makeUpsertComment({ commentsDb, isQuestionable })

const addComment = makeAddComment({ commentsDb, isQuestionable })
const editComment = makeEditComment({ commentsDb, isQuestionable })
const listPostComments = makeListPostComments({ commentsDb })
const removeComment = makeRemoveComment({ commentsDb })

const commentService = Object.freeze({
  addComment,
  editComment,
  listPostComments,
  removeComment
})

export default commentService
export { addComment, editComment, listPostComments, removeComment }
