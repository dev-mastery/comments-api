export default function pipe (...fns) {
  return param =>
    fns.reduce(
      (result, fn) => (result.then && result.then(fn)) || fn(result),
      param
    )
}
