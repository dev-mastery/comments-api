export default async function handleModeration ({ comment, isQuestionable }) {
  const shouldModerate = await isQuestionable({ text: comment.getText() })
  const moderated = { ...comment }
  if (shouldModerate) {
    moderated.unPublish()
  } else {
    moderated.publish()
  }
  return moderated
}
