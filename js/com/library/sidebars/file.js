import { LitElement, html, css } from '../../../../vendor/lit-element/lit-element.js'
import { classMap } from '../../../../vendor/lit-element/lit-html/directives/class-map.js'
import sidebarStyles from '../../../../css/com/library/sidebar.css.js'
import { format as formatBytes } from '../../../../vendor/bytes/index.js'
import { joinPath } from '../../../strings.js'
import { buildContextMenuItems } from '../files/list.js'
import * as contextMenu from '../../context-menu.js'

export class FileSidebar extends LitElement {
  static get properties () {
    return {
      datInfo: {type: Object},
      path: {type: String},
      fileInfo: {type: Object},
      preview: {type: String},
      tab: {type: String}
    }
  }

  constructor () {
    super()
    this.datInfo = null
    this.path = ''
    this._fileInfo = null
    this.preview = ''
    this.tab = 'preview'
    this.load()
  }

  set fileInfo (v) {
    this._fileInfo = v
    this.load() // trigger load
  }

  get fileInfo () {
    return this._fileInfo
  }

  get dat () {
    return this.datInfo.url
  }

  // data management
  // =

  async load () {
    var preview = ''

    if (this.fileInfo) {
      let archive = new DatArchive(this.fileInfo.url)
      if (!this.datInfo || this.datInfo.url !== archive.url) {
        this.datInfo = await archive.getInfo()
      }

      if (this.fileInfo.stat.isFile() && isTxt(this.fileInfo.name)) {
        try {
          preview = await archive.readFile(this.fileInfo.path, 'utf8')
          if (preview.length > 1e5) {
            preview = preview.slice(0, 1e5)
          }
        } catch (e) {
          console.debug(e)
          preview = ''
        }
      } else if (this.fileInfo.stat.isDirectory()) {
        preview = (await archive.readdir(this.fileInfo.path)).join('\n')
      }
    }
    this.preview = preview
    this.requestUpdate()
  }

  // rendering
  // =

  render () {
    if (!this.fileInfo || !this.datInfo) return html``
    const file = this.fileInfo
    const tabOpt = (id, label) => html`<a class="${classMap({current: id === this.tab})}" @click=${e => this.onClickTab(e, id)}>${label}</a>`
    return html`
      <link rel="stylesheet" href="/vendor/beaker-app-stdlib/css/fontawesome.css">
      <div class="panel">
        <div class="panel-body">
          <h2 class="name">${file.name}</h2>
          <div class="btn-group rounded" style="margin: 0">
            <button @click=${this.onClickOpen}><i class="fas fa-external-link-alt"></i> Open</button>
            <button @click=${this.onClickMenu}><i class="fas fa-ellipsis-h"></i></button>
          </div>
          ${file.stat.isDirectory() ? html`<p>Folder</p>` : html`<p>${formatBytes(file.stat.size)}</p>`}
        </div>
        <div class="panel-tabsnav">
          ${tabOpt('preview', 'Preview')}
        </div>
        <div class="panel-body">
          ${this.renderTabBody()}
        </div>
      </div>
    `
  }

  renderTabBody () {
    const file = this.fileInfo
    switch (this.tab) {
      case 'comments':
        return html`comments TODO`
      default:
        return html`
          ${file.stat.isFile() && isImg(file.name) ? html`<div class="preview"><img src="${file.url}"></div>` : ''}
          ${this.preview ? html`<div class="preview ${isTxt(file.name) ? 'txt' : ''}">${this.preview}</div>` : ''}
        `
    }
  }

  // events
  // =

  firstUpdated () {
    this.load()
  }

  onClickTab (e, id) {
    this.tab = id
  }

  onClickOpen (e) {
    window.open(joinPath(this.dat, this.path, this.fileInfo.name))
  }

  onClickMenu (e) {
    var items = buildContextMenuItems(this, this.fileInfo)
    if (!items) return

    e.preventDefault()
    e.stopPropagation()
    const style = `padding: 4px 0`  
    contextMenu.create({x: e.clientX, y: e.clientY, items, style, right: true, noBorders: true, fontAwesomeCSSUrl: '/vendor/beaker-app-stdlib/css/fontawesome.css'})
  }
}
FileSidebar.styles = [sidebarStyles, css`
.name {
  word-break: break-word;
}

.preview {
  font-size: 12px;
  margin: 10px 0;
  max-height: 300px;
  overflow: auto;
  white-space: pre;
}

.preview.txt {
  font-family: var(--code-font);
  font-size: 11px;
  background: #f9f9fa;
  border: 1px solid var(--border-color);
  border-radius: 2px;
  padding: 10px;
}

.preview img {
  max-width: 100%;
}
`]

customElements.define('beaker-library-file-sidebar', FileSidebar)

function isImg (name) {
  if (typeof name !== 'string') return false
  return /\.(png|jpg|jpeg|gif|ico)$/.test(name)
}

function isTxt (name) {
  if (typeof name !== 'string') return false
  return /\.(txt|js|json|css|htm|html|xml|md|datignore|gitignore)$/.test(name)
}