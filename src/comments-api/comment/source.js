export default function buildMakeSource ({ isValidIp }) {
  return function makeSource ({ ip, browser, referrer } = {}) {
    if (!ip) {
      throw new Error('Comment source must contain an IP.')
    }
    if (!isValidIp(ip)) {
      throw new RangeError('Comment source must contain a valid IP.')
    }
    return Object.freeze({
      getIp: () => ip,
      getBrowser: () => browser,
      getReferrer: () => referrer
    })
  }
}
