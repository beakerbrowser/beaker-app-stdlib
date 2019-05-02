import { LitElement, html } from '../../../../vendor/lit-element/lit-element.js'
import { format as formatBytes } from '../../../../vendor/bytes/index.js'
import { shortDate } from '../../../time.js'
import { buildContextMenuItems } from '../dats/list.js'
import * as contextMenu from '../../context-menu.js'
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
    // ${isUser ? html`<p><a target="_blank" href="intent:unwalled.garden/view-profile?url=${encodeURIComponent(this.url)}">View profile</a></p>` : ''}
    return html`
      <link rel="stylesheet" href="/vendor/beaker-app-stdlib/css/fontawesome.css">
      <div class="panel">
        <div class="panel-banner">
          <img class="cover" src="asset:cover:${this.url}">
          <img class="thumb" src="asset:thumb:${this.url}">
        </div>
        <div class="panel-body">
          <h2 class="title">
            <span>${this.datInfo.title || (isUser ? 'Anonymous' : 'Untitled')}</span>
          </h2>
          <p class="description">${this.datInfo.description.trim() || html`<em>No description</em>`}</p>
          <p>Size: ${formatBytes(this.datInfo.size)}<br>Modified: ${shortDate(this.datInfo.mtime)}</p>
          <div class="btn-group">
            <button><i class="fa fa-external-link-alt"></i> Open</button>
            <button><i class="fa fa-link"></i> Copy URL</button>
            <button @click=${this.onClickMenu}><i class="fas fa-ellipsis-h"></i></button>
          </div>
        </div>
      </div>
    `
  }

// saved: true
// owner: true
// connections: 0

// open with

// title: ""
// description: ""
// size: 13615
// mtime: 1556648172622

// localPath: "/Users/paulfrazee/work/beaker-user-website-template/assets"
// previewEnabled: true

  // events
  // =

  attributeChangedCallback (name, oldval, newval) {
    super.attributeChangedCallback(name, oldval, newval)
    if (name === 'url') {
      this.load()
    }
  }

  onClickMenu (e) {
    var items = buildContextMenuItems(this, this.datInfo, {shortened: true})
    if (!items) return

    e.preventDefault()
    e.stopPropagation()
    const style = `padding: 4px 0`  
    contextMenu.create({x: e.clientX, y: e.clientY, items, style, right: true, noBorders: true, fontAwesomeCSSUrl: '/vendor/beaker-app-stdlib/css/fontawesome.css'})
  }
}
DatSidebar.styles = [datSidebarStyles]

customElements.define('beaker-library-dat-sidebar', DatSidebar)
