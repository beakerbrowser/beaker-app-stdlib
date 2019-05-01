import { html } from '../../../../vendor/lit-element/lit-element.js'
import { Explorer } from '../explorer.js'
import './list.js'

const bookmarksAPI = navigator.importSystemAPI('bookmarks')

export class BookmarksExplorer extends Explorer {

  constructor () {
    super()
    this.bookmarks = []
    this.load()
  }

  // data management
  // =

  async load () {
    this.reset()
    this.safelyAccessListEl(el => el.clearSelection())

    this.bookmarks = await bookmarksAPI.query()
    console.log(this.bookmarks)
    
    this.bookmarks.forEach(bookmark => { bookmark.key = bookmark.record ? bookmark.record.url : bookmark.href })
    this.sort()
    this.requestUpdate()
  }

  sort (column = '', directionStr = '') {
    // current sort settings are maintained in the list, pull from there
    if (!column) column = this.safelyAccessListEl(el => el.sortColumn, 'createdAt')
    if (!directionStr) directionStr = this.safelyAccessListEl(el => el.sortDirection, 'asc')

    var direction = directionStr === 'asc' ? 1 : -1
    this.bookmarks.sort((a, b) => {
      var v
      if (column === 'author') {
        v = a.author.title.localeCompare(b.author.title)
      } else {
        if (typeof a[column] === 'string') {
          v = a[column].localeCompare(b[column])
        } else {
          v = b[column] - a[column]
        }
      }
      return v * direction
    })
    this.requestUpdate()
  }

  // rendering
  // =

  renderList () {
    var bookmarks = this.bookmarks
    if (this.searchFilter) {
      bookmarks = bookmarks.filter(bookmark => {
        if (bookmark.title && bookmark.title.toLowerCase().includes(this.searchFilter)) {
          return true
        } else if (bookmark.href && bookmark.href.toLowerCase().includes(this.searchFilter)) {
          return true
        }
        return false
      })
    }
    return html`
      <beaker-library-bookmarks-list
        .rows=${bookmarks}
        @sort=${this.onSort}
      ></beaker-library-bookmarks-list>
    `
  }

  renderToolbarButtons () {
    return this.renderToolbarDatabaseButtons('bookmarks')
  }

  // events
  // =

  onSort (e) {
    this.sort(e.detail.column, e.detail.direction)
  }

  // helpers
  // =

  safelyAccessListEl (fn, fallback = undefined) {
    try {
      return fn(this.shadowRoot.querySelector('beaker-library-bookmarks-list'))
    } catch (e) {
      // ignore
      console.debug(e)
      return fallback
    }
  }
}

customElements.define('beaker-library-bookmarks-explorer', BookmarksExplorer)