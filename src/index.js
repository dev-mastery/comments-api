import express from 'express'
import bodyParser from 'body-parser'
import { postComment, putComment, getComments } from './comment/controller'
import makeCallback from './helpers/express-callback'

const app = express()
app.use(bodyParser.json())
app.post('/comments', makeCallback(postComment))
app.put('/comments/:id', makeCallback(putComment))
app.get('/comments', makeCallback(getComments))

// listen for requests
app.listen(3000, () => {
  console.log('Server is listening on port 3000')
})
