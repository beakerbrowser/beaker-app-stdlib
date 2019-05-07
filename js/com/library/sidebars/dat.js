import { LitElement, html, css } from '../../../../vendor/lit-element/lit-element.js'
import { classMap } from '../../../../vendor/lit-element/lit-html/directives/class-map.js'
import { format as formatBytes } from '../../../../vendor/bytes/index.js'
import { shortDate } from '../../../time.js'
import { buildContextMenuItems } from '../dats/list.js'
import * as contextMenu from '../../context-menu.js'
import * as toast from '../../toast.js'
import sidebarStyles from '../../../../css/com/library/sidebar.css.js'

const profilesAPI = navigator.importSystemAPI('profiles')
const graphAPI = navigator.importSystemAPI('unwalled-garden-graph')

export class DatSidebar extends LitElement {
  static get properties () {
    return {
      url: {type: String},
      datInfo: {type: Object},
      tab: {type: String}
    }
  }

  constructor () {
    super()
    this.url = ''
    this.datInfo = null
    this.currentUser = null
    this.tab = 'about'
  }

  get currentUserUrl () {
    return this.currentUser ? this.currentUser.url : ''
  }

  get isPerson () {
    if (!this.datInfo) return false
    return (this.datInfo.type || []).includes('unwalled.garden/person')
  }

  get followers () {
    return this.datInfo.followers
  }

  get isFollowing () {
    return this.datInfo.followers.find(f => f.url === this.currentUser.url)
  }

  get isSelf () {
    return this.datInfo.url === this.currentUser.url
  }

  // data management
  // =

  async load () {
    this.currentUser = await profilesAPI.getCurrentUser()
    var archive = new DatArchive(this.url)
    var datInfo = await archive.getInfo()
    datInfo.followers = await graphAPI.listFollowers(datInfo.url)
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
              ${this.isPerson && !this.isSelf
                  ? html`
                    <button @click=${this.onToggleFollowing}>
                      <i class="fas fa-rss"></i> ${this.isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                  `
                  : ''}
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
    const type = this.datInfo.type || []
    const isPerson = type.includes('unwalled.garden/person')
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
          ${isPerson
            ? html`
              <div class="followers">
                <small>Followed by:</small>
                ${this.datInfo.followers.length === 0 ? html`Nobody you follow` : ''}
                ${this.datInfo.followers.map(f => html`
                  <a href="intent:unwalled.garden/view-profile?url=${encodeURIComponent(f.url)}" target="_blank">
                    <img class="avatar" src="asset:thumb:${f.url}">
                    ${f.title}
                  </a>
                `)}
              </div>
            ` : ''}
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
    var items = buildContextMenuItems(this, this.datInfo, {shortened: false})
    if (!items) return

    e.preventDefault()
    e.stopPropagation()
    const style = `padding: 4px 0`  
    contextMenu.create({x: e.clientX, y: e.clientY, items, style, right: true, noBorders: true, fontAwesomeCSSUrl: '/vendor/beaker-app-stdlib/css/fontawesome.css'})
  }

  onClickTab (e, id) {
    this.tab = id
  }

  async onToggleFollowing (e) {
    if (this.isFollowing) {
      await graphAPI.unfollow(this.datInfo.url)
      toast.create(`Unfollowed ${this.datInfo.title || 'Anonymous'}`)
    } else {
      await graphAPI.follow(this.datInfo.url)
      toast.create(`Followed ${this.datInfo.title || 'Anonymous'}`)
    }
    this.load()
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

.followers a {
  display: flex;
  align-items: center;
  color: inherit;
  text-decoration: none;
  padding: 5px 10px;
  margin: 5px 0;
}

.followers a:hover {
  background: #f5f5f7;
}

.followers .avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 5px;
}

`]

customElements.define('beaker-library-dat-sidebar', DatSidebar)
