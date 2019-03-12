import commentService from '../service'
import makePostComment from './post-comment'
import makePutComment from './put-comment'

const postComment = makePostComment({ addComment: commentService.addComment })
const putComment = makePutComment({ editComment: commentService.editComment })

const commentController = Object.freeze({
  postComment,
  putComment
})

export default commentController
export { postComment, putComment }
