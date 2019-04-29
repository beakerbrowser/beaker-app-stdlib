import { html } from '../../../../vendor/lit-element/lit-element.js'
import { Explorer } from '../explorer.js'
import { shorten, joinPath } from '../../../strings.js'
import { emit } from '../../../dom.js'
import './list.js'
import '../sidebars/dat.js'
import '../sidebars/file.js'

export class FilesExplorer extends Explorer {
  static get properties () {
    return {
      dat: {type: String},
      path: {type: String},
      datInfo: {type: Object}
    }
  }

  constructor () {
    super()
    this.dat = ''
    this.path = '/'
    this.datInfo = null
    this.files = []
  }

  get viewPath () {
    const gotoPath = p => () => {
      var detail = {
        view: 'files',
        dat: this.dat,
        path: p
      }
      emit(this, 'change-location', {detail})
    }
    var path = [
      {title: shorten(this.datInfo && this.datInfo.title ? this.datInfo.title : 'Untitled', 100), icon: 'fas fa-sitemap', onClick: gotoPath('/')}
    ]
    var pathUpTo = '/'
    for (let pathPart of this.path.split('/')) {
      if (!pathPart) continue
      pathUpTo = joinPath(pathUpTo, pathPart)
      path.push({title: pathPart, icon: 'far fa-folder-open', onClick: gotoPath(pathUpTo)})
    }
    return path
  }

  getFileByKey (key) {
    return this.files.find(d => d.key === key)
  }

  // data management
  // =

  async load () {
    this.reset()
    this.safelyAccessListEl(el => el.clearSelection())

    var archive = new DatArchive(this.dat)
    this.datInfo = await archive.getInfo()
    this.files = await archive.readdir(this.path, {stat: true})
    console.log(this.files)
    
    this.files.forEach(f => {
      f.key = f.name
      f.path = joinPath(this.path, f.name)
      f.url = joinPath(this.dat, this.path, f.name)
    })
    this.sort()
    this.requestUpdate()
  }

  sort (column = '', directionStr = '') {
    // current sort settings are maintained in the list, pull from there
    if (!column) column = this.safelyAccessListEl(el => el.sortColumn, 'name')
    if (!directionStr) directionStr = this.safelyAccessListEl(el => el.sortDirection, 'asc')

    var direction = directionStr === 'asc' ? 1 : -1
    console.log('sorting', column, directionStr)
    this.files.sort((a, b) => {
      var v
      if (column === 'name') {
        if (a.stat.isDirectory() && !b.stat.isDirectory()) v = -1
        else if (!a.stat.isDirectory() && b.stat.isDirectory()) v = 1
        else v = a.name.localeCompare(b.name)
      } else {
        v = b.stat[column] - a.stat[column]
      }
      return v * direction
    })
    this.requestUpdate()
  }

  async deleteFile (rows) {
    if (!confirm(`Delete ${rows.length > 1 ? 'these files' : 'this file'}? This cannot be undone.`)) {
      return
    }
    // permadelete
    var archive = new DatArchive(this.dat)
    for (let row of rows) {
      if (row.stat.isDirectory()) {
        await archive.rmdir(joinPath(this.path, row.name), {recursive: true})
      } else {
        await archive.unlink(joinPath(this.path, row.name))
      }
    }
    // reload state
    await this.load()
  }

  // rendering
  // =

  renderList () {
    var files = this.files
    if (this.searchFilter) {
      files = files.filter(file => {
        if (file.name && file.name.toLowerCase().includes(this.searchFilter)) {
          return true
        }
        return false
      })
    }
    return html`
      <beaker-library-files-list
        .rows=${files}
        dat="${this.dat}"
        path="${this.path}"
        .datInfo=${this.datInfo}
        @sort=${this.onSort}
        @delete=${this.onDelete}
      ></beaker-library-files-list>
    `
  }

  renderToolbarButtons () {
    var hasSingleSelection = this.selectedKeys.length === 1
    var isOwner = this.datInfo && this.datInfo.isOwner
    var canDelete = isOwner && this.selectedKeys.length > 0
    var files = this.selectedKeys.map(key => this.getFileByKey(key))
    return html`
      <div class="btn-group">
        <button ?disabled=${!hasSingleSelection} title="View/edit source" @click=${e => window.open(`beaker://editor/${files[0].url}`)}>
          <i class="far fa-fw fa-edit"></i> Edit
        </button>
        <button ?disabled=${!canDelete} title="Move to trash" @click=${e => this.deleteFile(files)}>
          <i class="far fa-fw fa-trash-alt"></i> Delete
        </button>
      </div>
    `
  }

  renderSidebarNoSelection () {
    return html`
      <beaker-library-dat-sidebar
        url="${this.dat}"
      ></beaker-library-dat-sidebar>
    `
  }

  renderSidebarOneSelection () {
    var fileInfo = this.getFileByKey(this.selectedKeys[0])
    return html`
      <beaker-library-file-sidebar
        .fileInfo="${fileInfo}"
      ></beaker-library-file-sidebar>
    `
  }

  renderSidebarMultiSelection () {
    return html`${this.selectedKeys.length} items selected`
  }

  // events
  // =

  attributeChangedCallback (name, oldval, newval) {
    super.attributeChangedCallback(name, oldval, newval)
    if ((name === 'dat' || name === 'path') && defined(this.dat) && defined(this.path)) {
      this.load()
    }
  }

  onSort (e) {
    this.sort(e.detail.column, e.detail.direction)
  }

  onDelete (e) {
    this.deleteFile(e.detail.rows)
  }

  // helpers
  //

  safelyAccessListEl (fn, fallback = undefined) {
    try {
      return fn(this.shadowRoot.querySelector('beaker-library-files-list'))
    } catch (e) {
      // ignore
      console.debug(e)
      return fallback
    }
  }
}

customElements.define('beaker-library-files-explorer', FilesExplorer)

function defined (v) {
  return typeof v !== 'undefined'
}
