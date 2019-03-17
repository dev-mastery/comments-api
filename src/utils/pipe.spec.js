import pipe from './pipe'
describe('pipe', () => {
  it('runs functions in sequence', () => {
    const addOne = x => x + 1
    const double = x => x * 2
    const addOneAndDouble = pipe(
      addOne,
      double
    )
    expect(addOneAndDouble(3)).toBe(8)
  })
  it('works with promises', async () => {
    const addOne = async x => x + 1
    const double = async x => x * 2
    const addOneAndDouble = pipe(
      addOne,
      double
    )
    expect(await addOneAndDouble(2)).toBe(6)
  })
  it('works with a mix of promises and non-promises', async () => {
    const addOne = async x => x + 1
    const double = x => x * 2
    const addOneAndDouble = pipe(
      addOne,
      double
    )
    expect(await addOneAndDouble(5)).toBe(12)
  })
  it('works with only 1 function', () => {
    const addOne = x => x + 1
    const addOneOnly = pipe(addOne)
    expect(addOneOnly(3)).toBe(4)
  })
  it('returns no-op when no functions are supplied', () => {
    const noop = pipe()
    expect(noop()).toBeUndefined()
  })
})
