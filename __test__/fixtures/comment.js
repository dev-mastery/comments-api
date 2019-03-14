import faker from 'faker'
import Id from '../../src/helpers/id'
export default function makeFakeComment (overrides) {
  return {
    id: Id.makeId(),
    author: faker.name.findName(),
    text: faker.lorem.paragraph(3),
    created: faker.date.recent(),
    modified: new Date().toJSON(),
    replyToId: Id.makeId(),
    postId: Id.makeId(),
    published: true,
    ...overrides
  }
}
