import makeUpsertComment from './upsert-comment'
import makeAddComment from './add-comment'
import makeEditComment from './edit-comment'
import commentsDb from '../db'
import isQuestionable from '../../helpers/is-questionable'

const upsertComment = makeUpsertComment({ commentsDb, isQuestionable })
const addComment = makeAddComment({ upsertComment })
const editComment = makeEditComment({ upsertComment })

const commentService = Object.freeze({
  addComment,
  editComment
})

export default commentService
