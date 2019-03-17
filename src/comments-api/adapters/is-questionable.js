import axios from 'axios'
import pipe from '../../utils/pipe'
import dotenv from 'dotenv'

dotenv.config()

// TODO: add spam filtering as well.
export default async function isQuestionable ({ text } = {}) {
  const callModerationApi = pipe(
    buildModerationApiCommand,
    axios,
    normalizeModerationApiResponse
  )
  return callModerationApi(text).catch(e => {
    console.log(e) // TODO: Error handling
    return true // if the API is unavailable, we assume text is questionable
  })
}

export function buildModerationApiCommand (text) {
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

export function normalizeModerationApiResponse (response) {
  return (
    !response.data.Classification ||
    response.data.Classification.ReviewRecommended
  )
}
