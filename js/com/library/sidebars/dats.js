import { LitElement, html } from '../../../../vendor/lit-element/lit-element.js'
import { getCategoryDescription, getCategoryIcon, getCategoryLabel } from '../dats/explorer.js'
import datsSidebarStyles from '../../../../css/com/library/sidebars/dats.css.js'

export class DatsSidebar extends LitElement {
  static get properties () {
    return {
      category: {type: String}
    }
  }

  constructor () {
    super()
    this.category = ''
  }

  // rendering
  // =

  render () {
    if (!this.category) return html``
    return html`
      <link rel="stylesheet" href="/vendor/beaker-app-stdlib/css/fontawesome.css">
      <div class="dats-info">
        <h2>
          <i class="${getCategoryIcon(this.category)}"></i>
          ${getCategoryLabel(this.category)}
        </h2>
        <p>${getCategoryDescription(this.category)}</p>
      </div>
    `
  }

}
DatsSidebar.styles = [datsSidebarStyles]

customElements.define('beaker-library-dats-sidebar', DatsSidebar)
