import axios from 'axios'
import qs from 'querystring'
import makeFakeComment from './fixtures/comment'
import dotenv from 'dotenv'
dotenv.config()
axios.defaults.validateStatus = function (status) {
  // Throw only if the status code is greater than or equal to 500
  return status < 500
}
describe('akismet', () => {
  it('works', async () => {
    const comment = makeFakeComment()
    const req = {
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
        is_test: false
      })
    }
    const res = await axios(req)
    expect(res.data).toBe(false)
  })
})
