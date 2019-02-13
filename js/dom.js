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