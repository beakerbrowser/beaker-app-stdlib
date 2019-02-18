import {LitElement, html, css} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import searchCSS from '../../../css/com/app-header/search.css.js'

export class AppHeaderSearch extends LitElement {
  static register (tagName = 'app-header-search') {
    customElements.define(tagName, AppHeaderSearch)
  }

  static get properties () {
    return {
      fontawesomeSrc: {type: String, attribute: 'fontawesome-src'}
    }
  }

  constructor () {
    super()
    this.fontawesomeSrc = ''
  }

  render () {
    return html`
      <link rel="stylesheet" href="${this.fontawesomeSrc}">
      <div class="search-container">
        <input placeholder="Search" type="text" class="search">
        <i class="fa fa-search"></i>
      </div>
    `
  }
}
AppHeaderSearch.styles = searchCSS