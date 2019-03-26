import faker from 'faker'
import cuid from 'cuid'
import crypto from 'crypto'

const Id = Object.freeze({
  makeId: cuid,
  isValidId: cuid.isCuid
})

function md5 (text) {
  return crypto
    .createHash('md5')
    .update(text, 'utf-8')
    .digest('hex')
}

export default function makeFakeComment (overrides) {
  const comment = {
    author: faker.name.findName(),
    createdOn: Date.now(),
    id: Id.makeId(),
    modifiedOn: Date.now(),
    postId: Id.makeId(),
    published: true,
    replyToId: Id.makeId(),
    text: faker.lorem.paragraph(3),
    source: {
      ip: faker.internet.ip(),
      browser: faker.internet.userAgent(),
      referrer: faker.internet.url()
    }
  }
  comment.hash = md5(
    comment.text +
      comment.published +
      (comment.author || '') +
      (comment.postId || '') +
      (comment.replyToId || '')
  )

  return {
    ...comment,
    ...overrides
  }
}
