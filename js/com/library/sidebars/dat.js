import { LitElement, html } from '../../../../vendor/lit-element/lit-element.js'
import datSidebarStyles from '../../../../css/com/library/sidebars/dat.css.js'

export class DatSidebar extends LitElement {
  static get properties () {
    return {
      url: {type: String},
      datInfo: {type: Object}
    }
  }

  constructor () {
    super()
    this.url = ''
    this.datInfo = null
  }

  // data management
  // =

  async load () {
    var archive = new DatArchive(this.url)
    this.datInfo = await archive.getInfo()
  }

  // rendering
  // =

  render () {
    if (!this.datInfo) return html``
    const type = this.datInfo.type || []
    const isUser = type.includes('unwalled.garden/user')
    return html`
      <div class="dat-info">
        ${isUser
          ? html`<img class="thumb" src="asset:thumb:${this.url}">`
          : html`<img class="favicon" src="asset:favicon:${this.url}">`}
        <h2 class="title">${this.datInfo.title}</h2>
        <p class="description">${this.datInfo.description}</p>
        ${type.length ? html`<p class="type"><strong>Type:</strong> ${type.join(' ')}</p>` : ''}
        ${isUser ? html`<p><a target="_blank" href="intent:unwalled.garden/view-profile?url=${encodeURIComponent(this.url)}">View profile</a></p>` : ''}
      </div>
    `
  }

  // events
  // =

  attributeChangedCallback (name, oldval, newval) {
    super.attributeChangedCallback(name, oldval, newval)
    if (name === 'url') {
      this.load()
    }
  }
}
DatSidebar.styles = [datSidebarStyles]

customElements.define('beaker-library-dat-sidebar', DatSidebar)
