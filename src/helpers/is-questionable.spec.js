import {
  buildModerationApiCommand,
  normalizeModerationApiResponse
} from './is-questionable'
import review from '../../__test__/fixtures/moderation-api/review.json'
import noReview from '../../__test__/fixtures/moderation-api/no-review.json'
import noClassification from '../../__test__/fixtures/moderation-api/no-classification.json'
import dotenv from 'dotenv'
dotenv.config()

describe('Is Questionable', () => {
  it('builds a valid Moderator API request', () => {
    const expected = {
      method: 'post',
      data: review.OriginalText,
      params: { classify: 'true' },
      headers: {
        'Content-Type': 'text/html',
        'Ocp-Apim-Subscription-Key': process.env.DM_MODERATOR_API_KEY
      },
      url: process.env.DM_MODERATOR_API_URL
    }
    expect(buildModerationApiCommand(review.OriginalText)).toEqual(expected)
  })
  it('handles a review recommendation', () => {
    expect(normalizeModerationApiResponse({ data: review })).toBe(true)
  })
  it('handles a no review recommendation', () => {
    expect(normalizeModerationApiResponse({ data: noReview })).toBe(false)
  })
  it('handles the lack of any recommendation', () => {
    expect(normalizeModerationApiResponse({ data: noClassification })).toBe(
      true
    )
  })
})
