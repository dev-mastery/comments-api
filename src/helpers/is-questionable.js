import axios from 'axios'
import pipe from './pipe'
import dotenv from 'dotenv'

dotenv.config()

// TODO: add spam filtering as well.
export default async function isQuestionable ({
  text,
  authorName,
  authorEmail,
  ip,
  createdOn,
  modifiedOn,
  testOnly
} = {}) {
  const callModerationApi = pipe(
    buildApiCommand,
    axios,
    normalizeApiResponse
  )
  return callModerationApi(text).catch(e => {
    console.log(e) // TODO: Error handling
    return true // if the API is unavailable, we assume text is questionable
  })
}

export function buildApiCommand (text) {
  return {
    method: 'post',
    data: text,
    params: { classify: 'true' },
    headers: {
      'Content-Type': 'text/html',
      'Ocp-Apim-Subscription-Key': process.env.DM_MODERATOR_API_KEY
    },
    url: process.env.DM_MODERATOR_API_URL
  }
}

export function normalizeApiResponse (response) {
  return (
    !response.data.Classification ||
    response.data.Classification.ReviewRecommended
  )
}
