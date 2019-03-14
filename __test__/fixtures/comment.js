import faker from 'faker'
import crypto from 'crypto'
import Id from '../../src/helpers/id'
export default function makeFakeComment (overrides) {
  const comment = {
    author: faker.name.findName(),
    created: faker.date.recent(),
    id: Id.makeId(),
    modified: new Date().toJSON(),
    postId: Id.makeId(),
    published: true,
    replyToId: Id.makeId(),
    text: faker.lorem.paragraph(3)
  }
  comment.hash = crypto
    .createHash('md5')
    .update(
      comment.text +
        (comment.author || '') +
        (comment.postId || '') +
        (comment.replyToId || ''),
      'utf-8'
    )
    .digest('hex')

  return {
    ...comment,
    ...overrides
  }
}
