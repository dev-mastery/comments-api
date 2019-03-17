import faker from 'faker'
import md5 from '../../src/utils/md5'
import Id from '../../src/utils/id'
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
