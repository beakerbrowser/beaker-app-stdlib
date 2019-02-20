import {pluralize} from './strings.js'

// simple timediff fn 
// replace this with Intl.RelativeTimeFormat when it lands in Beaker
// https://stackoverflow.com/questions/6108819/javascript-timestamp-to-relative-time-eg-2-seconds-ago-one-week-ago-etc-best
const msPerMinute = 60 * 1000;
const msPerHour = msPerMinute * 60;
const msPerDay = msPerHour * 24;
const msPerMonth = msPerDay * 30;
const msPerYear = msPerDay * 365;
const now = Date.now()
export function timeDifference (ts, short = false, postfix = 'ago') {
  var elapsed = now - ts
  if (elapsed < msPerMinute) {
    let n = Math.round(elapsed/1000)
    return `${n} ${short ? 's' : pluralize(n, 'second')} ${postfix}`
  } else if (elapsed < msPerHour) {
    let n = Math.round(elapsed/msPerMinute)
    return `${n} ${short ? 'm' : pluralize(n, 'minute')} ${postfix}`
  } else if (elapsed < msPerDay ) {
    let n = Math.round(elapsed/msPerHour )
    return `${n} ${short ? 'h' : pluralize(n, 'hour')} ${postfix}`
  } else if (elapsed < msPerMonth) {
    let n = Math.round(elapsed/msPerDay)
    return `${n} ${short ? 'd' : pluralize(n, 'day')} ${postfix}`
  } else if (elapsed < msPerYear) {
    let n = Math.round(elapsed/msPerMonth)
    return `${n} ${short ? 'm' : pluralize(n, 'month')} ${postfix}`
  } else {
    let n = Math.round(elapsed/msPerYear )
    return `${n} ${short ? 'y' : pluralize(n, 'year')} ${postfix}`
  }
}