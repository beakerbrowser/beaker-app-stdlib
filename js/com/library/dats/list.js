import { html, css } from '../../../../vendor/lit-element/lit-element.js'
import { List } from '../list.js'
import * as toast from '../../toast.js'
import { writeToClipboard } from '../../../clipboard.js'
import { emit } from '../../../dom.js'
import listCSS from '../../../../css/com/library/list.css.js'
import '../sidebars/dat.js'

export function buildContextMenuItems (self, row, {shortened} = {shortened: false}) {
  const copyUrl = () => {
    writeToClipboard(row.url)
    toast.create('Copied URL to clipboard')
  }
  const explore = () => {
    emit(self, 'change-location', {detail: {view: 'files', dat: row.url}})
  }
  var items = []
  if (!shortened) {
    items = items.concat([
      {icon: 'fa fa-fw fa-external-link-alt', label: 'Open in new tab', click: () => window.open(row.url)},
      {icon: 'fa fa-fw fa-link', label: 'Copy URL', click: copyUrl},
      '-'
    ])
  }
  if (row.url !== self.currentUserUrl) {
    items.push(html`<div class="section-header light small">Library</div>`)
    if (row.saved) {
      items.push({icon: 'fas fa-fw fa-minus', label: 'Remove from library', click: () => emit(self, 'remove-from-library', {detail: {rows: [row]}})})
    } else {
      items.push({icon: 'fas fa-fw fa-plus', label: 'Add to library', click: () => emit(self, 'add-to-library', {detail: {rows: [row]}})})
    }
    items.push({icon: 'far fa-fw fa-trash-alt', label: 'Delete files', click: () => emit(self, 'delete-permanently', {detail: {rows: [row]}})})
    items.push('-')
  }
  items = items.concat([
    html`<div class="section-header light small">Open with</div>`,
    {icon: 'far fa-fw fa-user', label: `Beaker.Social`, click: () => window.open(`intent:unwalled.garden/view-profile?url=${encodeURIComponent(row.url)}`)},
    '-',
    html`<div class="section-header light small">Developer tools</div>`,
    {icon: 'far fa-fw fa-folder-open', label: 'Explore files', click: explore},
    {icon: 'fas fa-fw fa-code', label: `Source Editor`, click: () => window.open(`beaker://editor/${row.url}`)},
  ])
  return items
}

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

  // data management
  // =

  buildContextMenuItems (row) {
    return buildContextMenuItems(this, row)
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

DatsList.styles = [listCSS, css`
.mode-big .row {
  font-size: 13px;
  height: 42px;
}

.mode-big .favicon,
.mode-big .thumb,
.mode-big .site img {
  width: 32px;
  height: 32px;
}
`]

customElements.define('beaker-library-dats-list', DatsList)