import {LitElement, html, css} from '../../vendor/lit-element/lit-element.js'
import {findParent} from '../dom.js'
import dropdownCSS from '../../css/com/dropdown-css.js'

// globals
// =

var resolve

// exported api
// =

// create a new context menu
// - returns a promise that will resolve to undefined when the menu goes away
// - example usage:
/*
create({
  // where to put the menu
  x: e.clientX,
  y: e.clientY,

  // align edge to right instead of left
  right: true,

  // use triangle
  withTriangle: true,

  // parent element to append to
  parent: document.body,

  // menu items
  items: [
    // icon from font-awesome
    {icon: 'link', label: 'Copy link', click: () => writeToClipboard('...')}
  ]

  // instead of items, can give render()
  render ({x, y}) {
    return yo`
      <div class="context-menu dropdown" style="left: ${x}px; top: ${y}px">
        <img src="smile.png" onclick=${contextMenu.destroy} />
      </div>
    `
  }
}
*/
export function create (opts) {
  // destroy any existing
  destroy()

  // extract attrs
  var parent = opts.parent || document.body

  // render interface
  parent.appendChild(new BeakerContextMenu(opts))
  document.addEventListener('keyup', onKeyUp)
  document.addEventListener('click', onClickAnywhere)

  // return promise
  return new Promise(_resolve => {
    resolve = _resolve
  })
}

export function destroy (value) {
  const el = document.querySelector('beaker-context-menu')
  if (el) {
    el.parentNode.removeChild(el)
    document.removeEventListener('keyup', onKeyUp)
    document.removeEventListener('click', onClickAnywhere)
    resolve(value)
  }
}

// global event handlers
// =

function onKeyUp (e) {
  e.preventDefault()
  e.stopPropagation()

  if (e.keyCode === 27) {
    destroy()
  }
}

function onClickAnywhere (e) {
  if (!findParent(e.target, el => el.tagName === 'BEAKER-CONTEXT-MENU')) {
    // click is outside the context-menu, destroy
    destroy()
  }
}

// internal
// =

class BeakerContextMenu extends LitElement {
  constructor ({x, y, right, withTriangle, items, fontAwesomeCSSUrl}) {
    super()
    this.x = x
    this.y = y
    this.right = right || false
    this.withTriangle = withTriangle || false
    this.items = items
    this.fontAwesomeCSSUrl = fontAwesomeCSSUrl
  }

  // rendering
  // =

  render() {
    return html`
      <link rel="stylesheet" href="${this.fontAwesomeCSSUrl}">
      <div class="context-menu dropdown" style="left: ${this.x}px; top: ${this.y}px">
        <div class="dropdown-items ${this.right ? 'right' : 'left'} ${this.withTriangle ? 'with-triangle' : ''}">
          ${this.items.map(item => {
            if (item === '-') {
              return html`<hr />`
            }
            var icon = item.icon
            if (icon && !icon.includes(' ')) {
              icon = 'fa fa-' + icon
            }
            if (item.disabled) {
              return html`
                <div class="dropdown-item disabled">
                  <i class="${icon}"></i>
                  ${item.label}
                </div>
              `
            }
            return html`
              <div class="dropdown-item" @click=${() => { destroy(); item.click() }}>
                <i class="${icon}"></i>
                ${item.label}
              </div>
            `
          })}
        </div>
      </div>`
  }
}

BeakerContextMenu.styles = css`
${dropdownCSS}
.context-menu {
  position: absolute;
  z-index: 10000;
}

.dropdown-items:not(.custom) {
  width: auto;
  white-space: nowrap;
}

.dropdown-item {
  padding-right: 30px; /* add a little cushion to the right */
}
`

customElements.define('beaker-context-menu', BeakerContextMenu)