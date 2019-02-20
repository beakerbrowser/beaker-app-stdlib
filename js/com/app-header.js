import {LitElement, html} from '../../vendor/lit-element/lit-element.js'
import * as appMenu from './app-menu.js'
import appHeaderCSS from '../../css/com/app-header.css.js'
import './app-header/search.js'

export class AppHeader extends LitElement {
  static get properties () {
    return {
      profilePicSrc: {type: String, attribute: 'profile-pic-src'},
      fontawesomeSrc: {type: String, attribute: 'fontawesome-src'}
    }
  }

  constructor () {
    super()
    this.profilePicSrc = ''
    this.fontawesomeSrc = ''
  }

  render() {
    return html`
      <link rel="stylesheet" href="${this.fontawesomeSrc}">
      <div>
        <beaker-app-header-search fontawesome-src="${this.fontawesomeSrc}"></beaker-app-header-search>
        <div class="spacer"></div>
        <a @click=${this.onClickAppMenu}><span class="fas fa-th"></span></a>
        <a class="todo"><span class="fas fa-bell"></span></a>
        <a href="dat://profile"><img class="profile" src="${this.profilePicSrc}"></a>
      </div>
    `
  }

  onClickAppMenu (e) {
    e.preventDefault()
    e.stopPropagation()

    var rect = e.currentTarget.getClientRects()[0]
    var x = rect.right + 10
    var y = rect.top + e.currentTarget.offsetHeight
    appMenu.create({x, y})
  }
}
AppHeader.styles = appHeaderCSS

customElements.define('beaker-app-header', AppHeader)