import { LitElement, html, css } from '../../../../vendor/lit-element/lit-element.js'
import { classMap } from '../../../../vendor/lit-element/lit-html/directives/class-map.js'
import { format as formatBytes } from '../../../../vendor/bytes/index.js'
import { shortDate } from '../../../time.js'
import { buildContextMenuItems } from '../dats/list.js'
import * as contextMenu from '../../context-menu.js'
import * as toast from '../../toast.js'
import sidebarStyles from '../../../../css/com/library/sidebar.css.js'

const profilesAPI = navigator.importSystemAPI('unwalled-garden-profiles')

export class DatSidebar extends LitElement {
  static get properties () {
    return {
      url: {type: String},
      datInfo: {type: Object},
      tab: {type: String},
      noExplore: {type: Boolean, attribute: 'no-explore'}
    }
  }

  constructor () {
    super()
    this.url = ''
    this.datInfo = null
    this.currentUser = null
    this.tab = 'about'
    this.noExplore = false
  }

  get currentUserUrl () {
    return this.currentUser ? this.currentUser.url : ''
  }

  get isPerson () {
    if (!this.datInfo) return false
    return (this.datInfo.type || []).includes('unwalled.garden/person')
  }

  get isSelf () {
    return this.datInfo.url === this.currentUser.url
  }

  // data management
  // =

  async load () {
    this.currentUser = await profilesAPI.me()
    var archive = new DatArchive(this.url)
    var datInfo = await archive.getInfo()
    this.datInfo = datInfo
  }

  // rendering
  // =

  render () {
    console.log(this.datInfo)
    if (!this.datInfo) return html``
    // ${isPerson ? html`<p><a target="_blank" href="intent:unwalled.garden/view-profile?url=${encodeURIComponent(this.url)}">View profile</a></p>` : ''}
    const tabOpt = (id, label) => html`<a class="${classMap({current: id === this.tab})}" @click=${e => this.onClickTab(e, id)}>${label}</a>`
    return html`
      <link rel="stylesheet" href="/vendor/beaker-app-stdlib/css/fontawesome.css">
      <div class="panel">
        <div class="panel-banner">
          <img class="cover" src="asset:cover:${this.url}">
          <img class="thumb" src="asset:thumb:${this.url}">
          <div class="ctrls">
            ${this.isSelf ? html`<span class="isyou">This is you</span>` : ''}
            <span class="btn-group rounded">
              <button @click=${this.onClickOpen}><i class="fas fa-external-link-alt"></i> Open</button>
              <button @click=${this.onClickMenu}><i class="fas fa-ellipsis-h"></i></button>
            </span>
          </div>
        </div>
        <div class="panel-body">
          <h2 class="title">
            <span>${this.datInfo.title || (this.isPerson ? 'Anonymous' : 'Untitled')}</span>
          </h2>
          <p class="description">${this.datInfo.description.trim() || html`<em>No description</em>`}</p>
        </div>
        <div class="panel-tabsnav">
          ${tabOpt('about', 'About')}
          ${''/*tabOpt('settings', 'Settings')*/}
        </div>
        <div class="panel-body">
          ${this.renderTabBody()}
        </div>
      </div>
    `
  }

  renderTabBody () {
    switch (this.tab) {
      case 'settings':
        return html`
          <p>
            <button class="flat"><i class="fas fa-server"></i> Host: <strong>This computer</strong> <i class="fas fa-angle-down"></i></button>
          </p>
          <p>
            <button class="flat"><i class="fas fa-download"></i> Download: <strong>As-needed</strong> <i class="fas fa-angle-down"></i></button>
          </p>
          <p>
            <button class="flat"><i class="fas fa-plug"></i> Disconnect</button>
          </p>
        `
      default:
        return html`
          <p>
            <small>Size:</small> ${formatBytes(this.datInfo.size)}<br><small>Last updated:</small> ${shortDate(this.datInfo.mtime)}
          </p>
        `
    }
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

  onClickOpen (e) {
    window.open(this.datInfo.url)
  }

  onClickMenu (e) {
    var items = buildContextMenuItems(this, this.datInfo, {noOpen: true, noExplore: this.noExplore})
    if (!items) return

    e.preventDefault()
    e.stopPropagation()
    const style = `padding: 4px 0`  
    contextMenu.create({x: e.clientX, y: e.clientY, items, style, right: true, noBorders: true, fontAwesomeCSSUrl: '/vendor/beaker-app-stdlib/css/fontawesome.css'})
  }

  onClickTab (e, id) {
    this.tab = id
  }
}
DatSidebar.styles = [sidebarStyles, css`
small {
  color: gray;
}

button {
  cursor: pointer;
}

.ctrls {
  display: flex;
  align-items: center;
}

.isyou {
  background: #eee;
  font-size: 11px;
  line-height: 26px;
  padding: 0 10px;
  border-radius: 16px;
}
`]

customElements.define('beaker-library-dat-sidebar', DatSidebar)
