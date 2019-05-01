import { html } from '../../../../vendor/lit-element/lit-element.js'
import { List } from '../list.js'
import { shortDate } from '../../../time.js'

export class BookmarksList extends List {
  constructor () {
    super()
    this.sortColumn = 'createdAt'
  }

  get columns () {
    return [
      {id: 'author', label: 'Author', width: 120, renderer: 'renderAuthor'},
      {id: 'title', label: 'Title', flex: 1},
      {id: 'href', label: 'Location', flex: 1},
      {id: 'createdAt', label: 'Date Published', width: 120, renderer: 'renderCreatedAt'}
    ]
  }

  // rendering
  // =

  renderCreatedAt (row) {
    return shortDate(row.createdAt)
  }

  renderAuthor (row) {
    return html`<div class="site">
      <span>${row.author.title}</span>
    </div>`
  }

  // events
  // =

  onDblclickRow (e, row) {
    window.open(row.href)
  }
}

customElements.define('beaker-library-bookmarks-list', BookmarksList)