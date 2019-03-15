export function findParent (node, test) {
  if (typeof test === 'string') {
    // classname default
    var cls = test
    test = el => el.classList && el.classList.contains(cls)
  }

  while (node) {
    if (test(node)) {
      return node
    }
    node = node.parentNode
  }
}

export function on (el, event, fn, opts) {
  el.addEventListener(event, fn, opts)
}

export function once (el, event, fn, opts) {
  opts = opts || {}
  opts.once = true
  el.addEventListener(event, fn, opts)
}

export function emit (el, evt, opts = {}) {
  opts.bubbles = ('bubbles' in opts) ? opts.bubbles : true
  el.dispatchEvent(new CustomEvent(evt, opts))
}