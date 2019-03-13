import { addComment, editComment, listPostComments } from '../service'
import makePostComment from './post-comment'
import makePutComment from './put-comment'
import makeGetComments from './get-comments'

const postComment = makePostComment({ addComment })
const putComment = makePutComment({ editComment })
const getComments = makeGetComments({
  listPostComments
})

const commentController = Object.freeze({
  postComment,
  putComment,
  getComments
})

export default commentController
export { postComment, putComment, getComments }
