import { html } from '../../../../vendor/lit-element/lit-element.js'
import { repeat } from '../../../../vendor/lit-element/lit-html/directives/repeat.js'
import { List } from '../list.js'
import { format as formatBytes } from '../../../../vendor/bytes/index.js'
import * as toast from '../../toast.js'
import { writeToClipboard } from '../../../clipboard.js'
import { shortDate } from '../../../time.js'
import { joinPath } from '../../../strings.js'
import { emit } from '../../../dom.js'
import './readme.js'

export class FilesList extends List {
  static get properties() {
    return { 
      rows: {type: Array},
      selectedRows: {type: Object},
      dat: {type: String},
      path: {type: String},
      datInfo: {type: Object}
    }
  }


  constructor () {
    super()
    this.sortColumn = 'name'
    this.dat = ''
    this.path = '/'
    this.datInfo = null
  }

  get columns () {
    return [
      {id: 'icon', width: 24, renderer: 'renderIcon'},
      {id: 'name', label: 'Name', flex: 1},
      {id: 'mtime', label: 'Date Modified', width: 150, renderer: 'renderMtime'},
      {id: 'size', label: 'Size', width: 80, renderer: 'renderSize'}
    ]
  }

  // data management
  // =

  buildContextMenuItems (row) {
    const isFile = row.stat.isFile()
    const url = joinPath(this.dat, this.path, row.name)
    const copyUrl = () => {
      writeToClipboard(url)
      toast.create('Copied URL to clipboard')
    }
    var items = [
      {icon: 'fa fa-external-link-alt', label: 'Open in new tab', click: () => window.open(url)},
      {icon: 'fa fa-link', label: 'Copy URL', click: copyUrl}
    ]
    if (isFile) {
      items.push('-')
      items.push({icon: 'far fa-edit', label: `Edit ${isFile ? 'file' : 'folder'}`, click: () => window.open(`beaker://editor/${url}`)})
    }
    if (this.datInfo.isOwner) {
      items.push('-')
      items.push({icon: 'far fa-trash-alt', label: `Delete ${isFile ? 'file' : 'folder'}`, click: () => emit(this, 'delete', {detail:{rows: [row]}})})
    }
    return items
  }

  // rendering
  // =

  renderIcon (row) {
    return html`
      <i class="${row.stat.isDirectory() ? 'fas fa-fw fa-folder' : 'far fa-fw fa-file'}"></i>
    `
  }

  renderMtime (row) {
    if (row.stat.isDirectory() || !row.stat.mtime) return ''
    return shortDate(row.stat.mtime)
  }

  renderSize (row) {
    return row.stat.isDirectory() ? '' : formatBytes(row.stat.size)
  }

  render () {
    return html`
      <link rel="stylesheet" href="${this.fontAwesomeCSSUrl}">
      ${this.hasHeadingLabels
        ? html`
          <div class="heading">
            ${repeat(this.columns, col => this.renderHeadingColumn(col))}
          </div>
        ` : ''}
      <div class="rows" @click=${this.onClickRows}>
        ${this.groups
          ? repeat(this.groups, group => this.renderGroup(group))
          : repeat(this.rows, row => this.getRowKey(row), row => this.renderRow(row))}
        ${this.rows.length === 0 ? this.renderEmpty() : ''}
        <beaker-library-files-readme
          .datInfo=${this.datInfo}
          path="${this.path}"
          .files=${this.rows}
        ></beaker-library-files-readme>
      </div>
    `
  }

  // events
  // =

  onDblclickRow (e, row) {
    var path = joinPath(this.path, row.name)
    if (row.stat.isDirectory()) {
      this.clearSelection()
      var detail = {view: 'files', dat: this.dat, path}
      emit(this, 'change-location', {detail})
    } else {
      window.open(`${this.dat}${path}`)
    }
  }
}

customElements.define('beaker-library-files-list', FilesList)
