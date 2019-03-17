export default async function handleModeration ({ comment, isQuestionable }) {
  const shouldModerate = await isQuestionable({
    text: comment.getText(),
    ip: comment.getSource().getIp(),
    browser: comment.getSource().getBrowser(),
    referrer: comment.getSource().getReferrer(),
    author: comment.getAuthor(),
    createdOn: comment.getCreatedOn(),
    modifiedOn: comment.getModifiedOn()
  })
  const moderated = { ...comment }
  if (shouldModerate) {
    moderated.unPublish()
  } else {
    moderated.publish()
  }
  return moderated
}
