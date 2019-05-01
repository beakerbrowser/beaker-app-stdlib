import { html } from '../../../../vendor/lit-element/lit-element.js'
import { List } from '../list.js'
import * as toast from '../../toast.js'
import { writeToClipboard } from '../../../clipboard.js'
import { emit } from '../../../dom.js'
import '../sidebars/dat.js'

export class DatsList extends List {
  static get properties() {
    return { 
      category: {type: String},
      currentUserUrl: {type: String, attribute: 'current-user-url'},
      currentUserTitle: {type: String, attribute: 'current-user-title'},
      rows: {type: Array},
      selectedRows: {type: Object}
    }
  }

  constructor () {
    super()
    this.sortColumn = 'title'
    this.category = ''
    this.currentUserUrl = ''
    this.currentUserTitle = ''
    this.rows = []
  }

  get columns () {
    return [
      {id: 'favicon', width: 22, renderer: 'renderFavicon'},
      {id: 'title', label: 'Title', width: 200, renderer: 'renderTitle'},
      {id: 'author', label: 'Author', width: 120, renderer: 'renderAuthor'},
      {id: 'description', label: 'Description', flex: 1},
      {id: 'primary-action', width: 20, renderer: 'renderPrimaryAction'},
      {id: 'hover-action', width: 24, renderer: 'renderHoverAction'},
    ]
  }

  get groups () {
    return [
      {label: 'Saved to your library', filterFn: r => r.saved},
      {label: 'Recently accessed', filterFn: r => !r.saved}
    ]
  }

  // data management
  // =

  buildContextMenuItems (row) {
    const copyUrl = () => {
      writeToClipboard(row.url)
      toast.create('Copied URL to clipboard')
    }
    const explore = () => {
      emit(this, 'change-location', {detail: {view: 'files', dat: row.url}})
    }
    var items = [
      {icon: 'fa fa-external-link-alt', label: 'Open in new tab', click: () => window.open(row.url)},
      {icon: 'fa fa-link', label: 'Copy URL', click: copyUrl},
      '-',
      {icon: 'far fa-folder-open', label: 'Explore', click: explore},
      {icon: 'far fa-edit', label: `${row.owner || row.url === this.currentUserUrl ? 'Edit' : 'View'} source`, click: () => window.open(`beaker://editor/${row.url}`)}
    ]
    if (row.url !== this.currentUserUrl) {
      items.push('-')
      if (row.saved) {
        items.push({icon: 'fas fa-minus', label: 'Remove from library', click: () => emit(this, 'remove-from-library', {detail: {rows: [row]}})})
      } else {
        items.push({icon: 'fas fa-plus', label: 'Add to library', click: () => emit(this, 'add-to-library', {detail: {rows: [row]}})})
      }
      items.push({icon: 'far fa-trash-alt', label: 'Delete files', click: () => emit(this, 'delete-permanently', {detail: {rows: [row]}})})
    }
    return items
  }

  // rendering
  // =

  renderTitle (row) {
    if (!row.title) return html`<em>Untitled</em>`
    return row.title
  }

  renderFavicon (row) {
    var isUser = row.type && row.type.includes('unwalled.garden/user')
    if (this.category === 'contacts') isUser = true // HACK- assume followed users are contacts for now
    if (isUser) {
      return html`<img class="thumb" src="asset:thumb:${row.url}">`
    }
    return html`<img class="favicon" src="asset:favicon:${row.url}">`
  }

  renderAuthor (row) {
    // TODO: when dats declare authorship, read that information for this
    if (row.owner || row.url === this.currentUserUrl) {
      return html`<div class="site">
        <span>You</span>
      </div>`
    }
    return html``
  }

  renderPrimaryAction (row) {
    if (row.saved) return html``
    return html`
      <button @click=${e => this.onClickAdd(e, row)}><i class="fas fa-plus"></i></button>
    `
  }

  renderHoverAction (row) {
    return html`
      <button @click=${e => this.onContextmenuRow(e, row)}><i class="fas fa-ellipsis-h"></i></button>
    `
  }

  // events
  // =

  onDblclickRow (e, row) {
    window.open(row.url)
  }

  onClickAdd (e, row) {
    emit(this, 'add-to-library', {detail: {rows: [row]}})
  }
}

customElements.define('beaker-library-dats-list', DatsList)