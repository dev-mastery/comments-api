import makeComment from '../comment'
export default function makeGetComments ({ commentsDb }) {
  return async function getComments ({ postId } = {}) {
    if (!postId) {
      throw new Error('You must supply a post id.')
    }
  }
}
