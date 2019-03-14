import {
  addComment,
  editComment,
  listComments,
  removeComment
} from '../service'
import makeDeleteComment from './delete-comment'
import makeGetComments from './get-comments'
import makePostComment from './post-comment'
import makePutComment from './put-comment'
import notFound from './not-found'

const deleteComment = makeDeleteComment({ removeComment })
const getComments = makeGetComments({
  listComments
})
const postComment = makePostComment({ addComment })
const putComment = makePutComment({ editComment })

const commentController = Object.freeze({
  deleteComment,
  getComments,
  notFound,
  postComment,
  putComment
})

export default commentController
export { deleteComment, getComments, notFound, postComment, putComment }
