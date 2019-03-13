import isQuestionable from '../src/helpers/is-questionable'
import review from './fixtures/moderation-api/review.json'
import noReview from './fixtures/moderation-api/no-review.json'
import noClassification from './fixtures/moderation-api/no-classification.json'

describe('Is Questionable', () => {
  // Content moderator API only allows 1 request per second.
  afterEach(done => setTimeout(() => done(), 1001))
  it('flags inappropriate content', async () => {
    const result = await isQuestionable(review.OriginalText)
    expect(result).toBe(true)
  })
  it('flags unintelligible content', async () => {
    expect(await isQuestionable(noClassification.OriginalText)).toBe(true)
  })
  it('accepts appropriate content', async () => {
    expect(await isQuestionable(noReview.OriginalText)).toBe(false)
  })
})
