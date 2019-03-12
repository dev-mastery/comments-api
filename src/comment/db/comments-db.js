import Id from '../../helpers/id'

export default function makeCommentsDb ({ makeDb }) {
  return Object.freeze({
    findAll,
    findById,
    findByPostId,
    findReplies,
    insert,
    remove,
    update
  })
  async function findAll () {
    const db = await makeDb()
    const result = await db.collection('comments').find({})
    return (await result.toArray()).map(({ _id: id, ...found }) => ({
      id,
      ...found
    }))
  }
  async function findById ({ id: _id }) {
    const db = await makeDb()
    const result = await db.collection('comments').find({ _id })
    const { _id: id, ...found } = (await result.toArray())[0]
    return { id, ...found }
  }
  async function findByPostId ({ postId, omitReplies = true }) {
    const db = await makeDb()
    const query = { onPostId: postId }
    if (omitReplies) {
      query.inReplyToCommentId = null
    }
    const result = await db.collection('comments').find(query)
    return (await result.toArray()).map(({ _id: id, ...found }) => ({
      id,
      ...found
    }))
  }
  async function findReplies ({ commentId }) {
    const db = await makeDb()
    const result = await db
      .collection('comments')
      .find({ inReplyToCommentId: commentId })
    return (await result.toArray()).map(({ _id: id, ...found }) => ({
      id,
      ...found
    }))
  }
  async function insert ({ id: _id = Id.makeId(), ...commentInfo }) {
    const db = await makeDb()
    const result = await db
      .collection('comments')
      .insertOne({ _id, ...commentInfo })
    const { _id: id, ...insertedInfo } = result.ops[0]
    return { id, ...insertedInfo }
  }
  async function update ({ id: _id, ...commentInfo }) {
    const db = await makeDb()
    const result = await db
      .collection('comments')
      .updateOne({ _id }, { $set: { ...commentInfo } })
    return result.modifiedCount > 0 ? { id: _id, ...commentInfo } : null
  }
  async function remove ({ id: _id }) {
    const db = await makeDb()
    const result = await db.collection('comments').deleteOne({ _id })
    return result.deletedCount
  }
}
