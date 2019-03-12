import mongodb from 'mongodb'

const MongoClient = mongodb.MongoClient
const url = process.env.DM_DB_URL
const dbName = 'comments_api'
const client = new MongoClient(url, { useNewUrlParser: true })

export async function makeDb () {
  if (!client.isConnected()) {
    await client.connect()
  }
  return client.db(dbName)
}
