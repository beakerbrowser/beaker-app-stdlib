export const DAT_KEY_REGEX = /[0-9a-f]{64}/i

export function ucfirst (str) {
  if (!str) str = ''
  if (typeof str !== 'string') str = '' + str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function pluralize (num, base, suffix = 's') {
  if (num === 1) { return base }
  return base + suffix
}

export function shorten (str, n = 6) {
  if (str.length > (n + 3)) {
    return str.slice(0, n) + '...'
  }
  return str
}

export function toNiceDomain (str) {
  if (!str) return ''
  try {
    var urlParsed = new URL(str)
    var domain = urlParsed.hostname
    if (DAT_KEY_REGEX.test(domain)) {
      domain = `${domain.slice(0, 4)}..${domain.slice(-2)}`
    }
    return domain
  } catch (e) {
    // ignore, not a url
  }
  return str
}