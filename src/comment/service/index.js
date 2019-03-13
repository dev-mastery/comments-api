import makeUpsertComment from './upsert-comment'
import makeAddComment from './add-comment'
import makeEditComment from './edit-comment'
import makeListPostComments from './list-post-comments'
import commentsDb from '../db'
import isQuestionable from '../../helpers/is-questionable'

const upsertComment = makeUpsertComment({ commentsDb, isQuestionable })
const addComment = makeAddComment({ upsertComment })
const editComment = makeEditComment({ upsertComment })
const listPostComments = makeListPostComments({ commentsDb })

const commentService = Object.freeze({
  addComment,
  editComment,
  listPostComments
})

export default commentService
export { addComment, editComment, listPostComments }
