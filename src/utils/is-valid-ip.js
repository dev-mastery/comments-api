import ipRegex from 'ip-regex'

export default function isValidIp (ip) {
  return ipRegex({ exact: true }).test(ip)
}
