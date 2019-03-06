import {LitElement, html} from '../../vendor/lit-element/lit-element.js'
import {classMap} from '../../vendor/lit-element/lit-html/directives/class-map.js'
import * as appMenu from './app-menu.js'
import appHeaderCSS from '../../css/com/app-header.css.js'
import './app-header/search.js'

export class AppHeader extends LitElement {
  static get properties () {
    return {
      fullwidth: {type: Boolean},
      currentUserUrl: {type: String, attribute: 'current-user-url'},
      fontawesomeSrc: {type: String, attribute: 'fontawesome-src'},
      viewProfileBaseUrl: {type: String, attribute: 'view-profile-base-url'}
    }
  }

  constructor () {
    super()
    this.fullwidth = false
    this.currentUserUrl = ''
    this.fontawesomeSrc = ''
    this.viewProfileBaseUrl = ''
  }

  render() {
    const cls = classMap({fullwidth: this.fullwidth})
    return html`
      <link rel="stylesheet" href="${this.fontawesomeSrc}">
      <div class="${cls}">
        <beaker-app-header-search fontawesome-src="${this.fontawesomeSrc}" view-profile-base-url="${this.viewProfileBaseUrl}"></beaker-app-header-search>
        <div class="spacer"></div>
        <a class="text" href="/">Home</a>
        <a @click=${this.onClickAppMenu}><span class="fas fa-th"></span></a>
        <a class="todo"><span class="fas fa-bell"></span></a>
        <a href="intent:unwalled.garden/view-profile?url=${encodeURIComponent(this.currentUserUrl)}">
          <img class="profile" src="${this.currentUserUrl}/thumb">
        </a>
      </div>
    `
  }

  onClickAppMenu (e) {
    e.preventDefault()
    e.stopPropagation()

    var rect = e.currentTarget.getClientRects()[0]
    var x = rect.right + 10
    var y = rect.top + e.currentTarget.offsetHeight
    appMenu.create({x, y, currentUserUrl: this.currentUserUrl})
  }
}
AppHeader.styles = appHeaderCSS

customElements.define('beaker-app-header', AppHeader)