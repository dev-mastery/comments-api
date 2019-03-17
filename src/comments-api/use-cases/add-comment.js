import makeComment from '../entities/comment'
import handleModeration from './handle-moderation'
export default function makeAddComment ({ commentsDb, isQuestionable }) {
  return async function addComment (commentInfo) {
    const comment = makeComment(commentInfo)
    const exists = await commentsDb.findByHash({ hash: comment.getHash() })
    if (exists) {
      return exists
    }

    const moderated = await handleModeration({ isQuestionable, comment })

    return commentsDb.insert({
      id: moderated.getId(),
      author: moderated.getAuthor(),
      text: moderated.getText(),
      createdOn: moderated.getCreated(),
      hash: moderated.getHash(),
      modifiedOn: moderated.getModifiedOn(),
      replyToId: moderated.getReplyToId(),
      published: moderated.isPublished(),
      postId: moderated.getPostId()
    })
  }
}
