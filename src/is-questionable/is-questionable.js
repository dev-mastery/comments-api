export default function makeIsQuestionable ({
  pipe,
  issueHttpRequest,
  querystring
}) {
  return async function isQuestionable ({
    author,
    browser,
    createdOn,
    ip,
    modifiedOn,
    referrer,
    testOnly,
    text
  } = {}) {
    const callModerationApi = pipe(
      buildModerationApiCommand,
      issueHttpRequest,
      normalizeModerationApiResponse
    )
    const callSpamApi = pipe(
      buildAkismetApiCommand,
      issueHttpRequest,
      normalizeAkismetApiResponse
    )

    try {
      const [inappropriate, spam] = await Promise.all([
        callModerationApi(text),
        callSpamApi({
          author,
          browser,
          createdOn,
          ip,
          modifiedOn,
          querystring,
          referrer,
          testOnly,
          text
        })
      ])
      return inappropriate || spam
    } catch (e) {
      console.log(e)
      return true
    }
  }
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

export function buildAkismetApiCommand ({
  author,
  browser,
  createdOn,
  ip,
  modifiedOn,
  querystring,
  referrer,
  testOnly,
  text
}) {
  return {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: process.env.DM_SPAM_API_URL,
    method: 'post',
    data: querystring.stringify({
      blog: 'https://devmastery.com',
      user_ip: ip,
      user_agent: browser,
      referrer,
      comment_type: 'comment',
      comment_author: author,
      comment_content: text,
      comment_date_gmt: new Date(createdOn).toISOString(),
      comment_post_modified_gmt: new Date(modifiedOn).toISOString(),
      blog_lang: 'en',
      is_test: testOnly
    })
  }
}

export function normalizeAkismetApiResponse (response) {
  return response.data
}
