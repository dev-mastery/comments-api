import makeComment from '../comment'
export default function makeAddComment ({ commentsDb, handleModeration }) {
  return async function addComment (commentInfo) {
    const comment = makeComment(commentInfo)
    const exists = await commentsDb.findByHash({ hash: comment.getHash() })
    if (exists) {
      return exists
    }

    const moderated = await handleModeration({ comment })
    const commentSource = moderated.getSource()
    return commentsDb.insert({
      author: moderated.getAuthor(),
      createdOn: moderated.getCreatedOn(),
      hash: moderated.getHash(),
      id: moderated.getId(),
      modifiedOn: moderated.getModifiedOn(),
      postId: moderated.getPostId(),
      published: moderated.isPublished(),
      replyToId: moderated.getReplyToId(),
      source: {
        ip: commentSource.getIp(),
        browser: commentSource.getBrowser(),
        referrer: commentSource.getReferrer()
      },
      text: moderated.getText()
    })
  }
}
