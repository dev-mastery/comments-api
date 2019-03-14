import express from 'express'
import bodyParser from 'body-parser'
import {
  deleteComment,
  getComments,
  notFound,
  postComment,
  patchComment
} from './comment/controller'
import makeCallback from './helpers/express-callback'

const app = express()
app.use(bodyParser.json())
app.post('/comments', makeCallback(postComment))
app.delete('/comments/:id', makeCallback(deleteComment))
app.delete('/comments', makeCallback(deleteComment))
app.patch('/comments/:id', makeCallback(patchComment))
app.patch('/comments', makeCallback(patchComment))
app.get('/comments', makeCallback(getComments))
app.use(makeCallback(notFound))

// listen for requests
app.listen(3000, () => {
  console.log('Server is listening on port 3000')
})
