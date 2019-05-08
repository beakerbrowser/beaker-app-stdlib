import { html, css } from '../../../../vendor/lit-element/lit-element.js'
import { List } from '../list.js'
import { shortDate } from '../../../time.js'
import { emit } from '../../../dom.js'
import * as toast from '../../toast.js'
import { writeToClipboard } from '../../../clipboard.js'
import listCSS from '../../../../css/com/library/list.css.js'

export function buildContextMenuItems (self, row) {
  const copyUrl = () => {
    writeToClipboard(row.href)
    toast.create('Copied URL to clipboard')
  }
  var items = [
    {icon: 'fa fa-external-link-alt', label: 'Open in new tab', click: () => window.open(row.href)},
    {icon: 'fa fa-link', label: 'Copy URL', click: copyUrl}
  ]
  if (row.isOwner) {
    items.push('-')
    items.push({icon: 'far fa-edit', label: `Edit bookmark`, click: () => emit(self, 'edit-bookmark', {detail: {bookmark: row}})})
    items.push({icon: 'far fa-trash-alt', label: `Delete bookmark`, click: () => emit(self, 'delete-bookmark', {detail: {bookmark: row}})})
  }
  return items
}

export class BookmarksList extends List {
  static get properties() {
    return { 
      rows: {type: Array},
      selectedRows: {type: Object},
      currentUserUrl: {type: String, attribute: 'current-user-url'}
    }
  }

  constructor () {
    super()
    this.currentUserUrl = ''
  }

  get columns () {
    return [
      {id: 'privacy', width: 22, renderer: 'renderPrivacy'},
      {id: 'favicon', width: 22, renderer: 'renderFavicon'},
      {id: 'title', label: 'Title', width: 200},
      {id: 'author', label: 'Author', width: 120, renderer: 'renderAuthor'},
      {id: 'description', label: 'Description', flex: 1},
      {id: 'href', label: 'Location', width: 160},
      {id: 'createdAt', label: 'Date Created', width: 90, renderer: 'renderCreatedAt'},
    ]
  }

  buildContextMenuItems (row) {
    return buildContextMenuItems(this, row)
  }

  // rendering
  // =

  renderFavicon (row) {
    return html`<img class="favicon" src="asset:favicon:${row.href}">`
  }

  renderCreatedAt (row) {
    return shortDate(row.createdAt)
  }

  renderPrivacy (row) {
    return row.isPublic ? html`<i class="fas fa-fw fa-broadcast-tower"></i>` : html``
  }

  renderAuthor (row) {
    return html`<div class="site">
      <span>${row.author.url === this.currentUserUrl ? 'Me' : row.author.title}</span>
    </div>`
  }

  // events
  // =

  onDblclickRow (e, row) {
    window.open(row.href)
  }
}
BookmarksList.styles = [listCSS, css`
i {
  color: rgba(0,0,0,.4);
}
`]

customElements.define('beaker-library-bookmarks-list', BookmarksList)