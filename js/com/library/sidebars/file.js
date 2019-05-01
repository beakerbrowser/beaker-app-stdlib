import { LitElement, html } from '../../../../vendor/lit-element/lit-element.js'
import fileSidebarStyles from '../../../../css/com/library/sidebars/file.css.js'
import { format as formatBytes } from '../../../../vendor/bytes/index.js'

export class FileSidebar extends LitElement {
  static get properties () {
    return {
      fileInfo: {type: Object},
      preview: {type: String}
    }
  }

  constructor () {
    super()
    this._fileInfo = null
    this.preview = ''
    this.load()
  }

  set fileInfo (v) {
    this._fileInfo = v
    this.load() // trigger load
  }

  get fileInfo () {
    return this._fileInfo
  }

  // data management
  // =

  async load () {
    var preview = ''
    if (this.fileInfo && this.fileInfo.stat.isFile() && isTxt(this.fileInfo.name)) {
      try {
        let archive = new DatArchive(this.fileInfo.url)
        preview = await archive.readFile(this.fileInfo.path, 'utf8')
        if (preview.length > 1000) {
          preview = preview.slice(0, 1000)
        }
      } catch (e) {
        console.debug(e)
        preview = ''
      }
    }
    this.preview = preview
    this.requestUpdate()
  }

  // rendering
  // =

  render () {
    if (!this.fileInfo) return html``
    const file = this.fileInfo
    return html`
      <div class="file-info">
        ${file.stat.isFile() && isImg(file.name) ? html`<img src="${file.url}">` : ''}
        ${this.preview ? html`<pre class="preview">${this.preview}</pre>` : ''}
        <h2 class="name">${file.name}</h2>
        ${file.stat.isDirectory() ? '' : html`<p>${formatBytes(file.stat.size)}</p>`}
      </div>
    `
  }

  // events
  // =

  firstUpdated () {
    this.load()
  }
}
FileSidebar.styles = [fileSidebarStyles]

customElements.define('beaker-library-file-sidebar', FileSidebar)

function isImg (name) {
  if (typeof name !== 'string') return false
  return /\.(png|jpg|jpeg|gif|ico)$/.test(name)
}

function isTxt (name) {
  if (typeof name !== 'string') return false
  return /\.(txt|js|json|css|htm|html|xml|datignore|gitignore)$/.test(name)
}