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

export function toDomain (str) {
  if (!str) return ''
  try {
    var urlParsed = new URL(str)
    return urlParsed.hostname
  } catch (e) {
    // ignore, not a url
  }
  return str
}

export function toNiceDomain (str) {
  var domain = toDomain(str)
  if (DAT_KEY_REGEX.test(domain)) {
    domain = `${domain.slice(0, 4)}..${domain.slice(-2)}`
  }
  return domain
}

export function toNiceUrl (str) {
  if (!str) return ''
  try {
    var urlParsed = new URL(str)
    if (DAT_KEY_REGEX.test(urlParsed.hostname)) {
      urlParsed.hostname = `${urlParsed.hostname.slice(0, 4)}..${urlParsed.hostname.slice(-2)}`
    }
    return urlParsed.toString()
  } catch (e) {
    // ignore, not a url
  }
  return str
}

export function makeSafe (str = '') {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g, '&amp;').replace(/"/g, '&quot;')
}

// search results are returned from beaker's search APIs with nonces wrapping the highlighted sections
// e.g. a search for "test" might return "the {500}test{/500} result"
// this enables us to safely escape the HTML, then replace the nonces with <strong> tags
export function highlightSearchResult (str = '', nonce = 0) {
  var start = new RegExp(`\\{${nonce}\\}`, 'g') // eg {500}
  var end = new RegExp(`\\{/${nonce}\\}`, 'g') // eg {/500}
  return makeSafe(str).replace(start, '<strong>').replace(end, '</strong>')
}