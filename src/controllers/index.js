import {
  addComment,
  editComment,
  listComments,
  removeComment
} from '../use-cases'
import makeDeleteComment from './delete-comment'
import makeGetComments from './get-comments'
import makePostComment from './post-comment'
import makePatchComment from './patch-comment'
import notFound from './not-found'

const deleteComment = makeDeleteComment({ removeComment })
const getComments = makeGetComments({
  listComments
})
const postComment = makePostComment({ addComment })
const patchComment = makePatchComment({ editComment })

const commentController = Object.freeze({
  deleteComment,
  getComments,
  notFound,
  postComment,
  patchComment
})

export default commentController
export { deleteComment, getComments, notFound, postComment, patchComment }
