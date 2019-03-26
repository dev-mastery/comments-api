import isQuestionable from '../src/is-questionable'
import review from './fixtures/moderation-api/review.json'
import noReview from './fixtures/moderation-api/no-review.json'
import noClassification from './fixtures/moderation-api/no-classification.json'
import makeFakeComment from './fixtures/comment'

describe('Is Questionable', () => {
  // Content moderator API only allows 1 request per second.
  afterEach(done => setTimeout(() => done(), 1100))
  it('flags inappropriate content', async () => {
    const comment = makeFakeComment({ text: review.OriginalText })
    const result = await isQuestionable({
      text: comment.text,
      ip: comment.source.ip,
      browser: comment.source.browser,
      referrer: comment.source.referrer,
      author: comment.author,
      createdOn: comment.createdOn,
      modifiedOn: comment.modifiedOn,
      testOnly: true
    })
    expect(result).toBe(true)
  })
  it('flags unintelligible content', async () => {
    const comment = makeFakeComment({ text: noClassification.OriginalText })
    const result = await isQuestionable({
      text: comment.text,
      ip: comment.source.ip,
      browser: comment.source.browser,
      referrer: comment.source.referrer,
      author: comment.author,
      createdOn: comment.createdOn,
      modifiedOn: comment.modifiedOn,
      testOnly: true
    })
    expect(result).toBe(true)
  })
  it('accepts appropriate content', async () => {
    const comment = makeFakeComment({ text: noReview.OriginalText })
    const result = await isQuestionable({
      text: comment.text,
      ip: comment.source.ip,
      browser: comment.source.browser,
      referrer: comment.source.referrer,
      author: comment.author,
      createdOn: comment.createdOn,
      modifiedOn: comment.modifiedOn,
      testOnly: true
    })
    expect(result).toBe(false)
  })
  it('filters out spam', async () => {
    const comment = makeFakeComment({
      text: noReview.OriginalText,
      author: 'viagra-test-123'
    })
    const result = await isQuestionable({
      text: comment.text,
      ip: comment.source.ip,
      browser: comment.source.browser,
      referrer: comment.source.referrer,
      author: comment.author,
      createdOn: comment.createdOn,
      modifiedOn: comment.modifiedOn,
      testOnly: true
    })
    expect(result).toBe(true)
  })
})
