import axios from 'axios'
import pipe from '@devmastery/pipe'
import makeIsQuestionable from './is-questionable'

const isQuestionable = makeIsQuestionable({
  issueHttpRequest: axios,
  pipe
})

export default isQuestionable
