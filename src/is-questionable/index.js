import axios from 'axios'
import querystring from 'querystring'
import pipe from '@devmastery/pipe'
import makeIsQuestionable from './is-questionable'

const isQuestionable = makeIsQuestionable({
  issueHttpRequest: axios,
  pipe,
  querystring
})

export default isQuestionable
