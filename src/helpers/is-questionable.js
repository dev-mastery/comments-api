import axios from 'axios'
import pipe from './pipe'
import dotenv from 'dotenv'

dotenv.config()

export default async function isQuestionable (content) {
  const callModerationApi = pipe(
    buildApiCommand,
    axios,
    normalizeApiResponse
  )
  return callModerationApi(content).catch(e => {
    console.log(e) // TODO: Error handling
    return true // if the API is unavailable, we assume content is questionable
  })
}

export function buildApiCommand (content) {
  return {
    method: 'post',
    data: content,
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
