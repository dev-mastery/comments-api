import makeCommentsDb from './comments-db'
import mongodb from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()

const MongoClient = mongodb.MongoClient
const url = process.env.DM_DB_URL
const dbName = 'dm_comments_api'
const client = new MongoClient(url, { useNewUrlParser: true })

async function makeDb () {
  if (!client.isConnected()) {
    await client.connect()
  }
  return client.db(dbName)
}

const commentsDb = makeCommentsDb({ makeDb })
export default commentsDb
