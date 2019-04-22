import {
  buildModerationApiCommand,
  normalizeModerationApiResponse,
  buildAkismetApiCommand
} from './is-questionable'
import makeFakeComment from '../../__test__/fixtures/comment'
import review from '../../__test__/fixtures/moderation-api/review.json'
import noReview from '../../__test__/fixtures/moderation-api/no-review.json'
import noClassification from '../../__test__/fixtures/moderation-api/no-classification.json'
import dotenv from 'dotenv'
import qs from 'querystring'
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
  it('builds a valid Akismet API request', () => {
    const comment = makeFakeComment()
    const expected = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      url: process.env.DM_SPAM_API_URL,
      method: 'post',
      data: qs.stringify({
        blog: 'https://devmastery.com',
        user_ip: comment.source.ip,
        user_agent: comment.source.browser,
        referrer: comment.source.referrer,
        comment_type: 'comment',
        comment_author: comment.author,
        comment_content: comment.text,
        comment_date_gmt: new Date(comment.createdOn).toISOString(),
        comment_post_modified_gmt: new Date(comment.modifiedOn).toISOString(),
        blog_lang: 'en',
        is_test: true
      })
    }
    const actual = buildAkismetApiCommand({
      text: comment.text,
      ip: comment.source.ip,
      browser: comment.source.browser,
      referrer: comment.source.referrer,
      author: comment.author,
      createdOn: comment.createdOn,
      modifiedOn: comment.modifiedOn,
      testOnly: true,
      querystring: qs
    })
    expect(actual).toEqual(expected)
  })
})
