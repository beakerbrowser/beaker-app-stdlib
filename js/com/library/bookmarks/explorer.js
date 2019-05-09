import { html } from '../../../../vendor/lit-element/lit-element.js'
import { classMap } from '../../../../vendor/lit-element/lit-html/directives/class-map.js'
import { Explorer } from '../explorer.js'
import { BeakerEditBookmarkPopup } from '../../popups/edit-bookmark.js'
import * as toast from '../../toast.js'
import { emit } from '../../../dom.js'
import './list.js'
import './sidebar.js'

const profilesAPI = navigator.importSystemAPI('profiles')
const bookmarksAPI = navigator.importSystemAPI('bookmarks')
const graphAPI = navigator.importSystemAPI('unwalled-garden-graph')

export class BookmarksExplorer extends Explorer {
  static get properties () {
    return {
      ownerFilter: {type: String, attribute: 'owner-filter'},
      searchFilter: {type: String},
      selectedKeys: {type: Array}
    }
  }

  constructor () {
    super()
    this.ownerFilter = ''
    this.currentUser = null
    this.bookmarks = []
    this.load()
  }

  getBookmarkByKey (key) {
    return this.bookmarks.find(b => b.key === key)
  }

  get viewPath () {
    return [
      {title: 'Bookmarks', icon: 'far fa-star', onClick: e => emit(this, 'change-location', {detail: {view: 'bookmarks'}})}
    ]
  }

  // data management
  // =

  async load () {
    this.reset()
    this.safelyAccessListEl(el => el.clearSelection())

    var currentUser = this.currentUser = await profilesAPI.getCurrentUser()
    if (this.ownerFilter === 'network') {
      let authors = [currentUser].concat(await graphAPI.listFollows(currentUser.url))
      this.bookmarks = await bookmarksAPI.query({filters: {authors: authors.map(f => f.url)}})
    } else {
      this.bookmarks = await bookmarksAPI.query({filters: {authors: currentUser.url}})
    }
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

  async addBookmark () {
    try {
      // render popup
      var b = await BeakerEditBookmarkPopup.create({
        href: '',
        title: '',
        tags: [],
        pinned: true
      }, {
        fontawesomeSrc: '/vendor/beaker-app-stdlib/css/fontawesome.css'
      })
      
      // make update
      await bookmarksAPI.add(b)
      await this.load()
    } catch (e) {
      // ignore
      console.log(e)
    }
  }

  async editBookmark (originalBookmark) {
    try {
      // render popup
      var b = await BeakerEditBookmarkPopup.create(originalBookmark, {
        fontawesomeSrc: '/vendor/beaker-app-stdlib/css/fontawesome.css'
      })
      
      // make update
      await bookmarksAPI.edit(originalBookmark.href, b)
      await this.load()
    } catch (e) {
      // ignore
      console.log(e)
    }
  }

  async deleteBookmark (bookmark) {
    await bookmarksAPI.remove(bookmark.href)
    await this.load()

    const undo = async () => {
      await bookmarksAPI.add(bookmark)
      await this.load()
    }

    toast.create('Bookmark deleted', '', 10e3, {label: 'Undo', click: undo})
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
        current-user-url="${this.currentUser ? this.currentUser.url : ''}"
        @sort=${this.onSort}
        @add-bookmark=${this.addBookmark}
        @edit-bookmark=${this.onEditBookmark}
        @delete-bookmark=${this.onDeleteBookmark}
      ></beaker-library-bookmarks-list>
    `
  }

  renderToolbar () {
    const filterOpt = (v, label) => {
      const cls = classMap({pressed: v == this.ownerFilter, radio: true})
      return html`<button class="${cls}" @click=${e => { emit(this, 'change-location', {detail: {view: 'bookmarks', ownerFilter: v}}) }}>${label}</button>`
    }
    return html`
      <div class="path" style="margin-right: 20px;">${this.renderPath()}</div>
      <div class="radio-group">
        ${filterOpt(false, 'My bookmarks')}
        ${filterOpt('network', 'Network')}
      </div>
      <div class="spacer"></div>
      ${this.renderToolbarSearch()}
      <div class="btn-group">
        <button @click=${this.onClickNew} class="primary"><i class="fa-fw fas fa-plus"></i> New bookmark</button>
      </div>
    `
  }

  renderSidebarOneSelection () {
    var bookmark = this.getBookmarkByKey(this.selectedKeys[0])
    return html`
      <beaker-library-bookmark-sidebar
        .bookmark="${bookmark}"
        @edit-bookmark=${this.onEditBookmark}
        @delete-bookmark=${this.onDeleteBookmark}
      ></beaker-library-bookmark-sidebar>
    `
  }

  // events
  // =

  onSort (e) {
    this.sort(e.detail.column, e.detail.direction)
  }

  onClickNew (e) {
    this.addBookmark()
  }

  onEditBookmark (e) {
    this.editBookmark(e.detail.bookmark)
  }

  onDeleteBookmark (e) {
    this.deleteBookmark(e.detail.bookmark)
  }

  // helpers
  // =

  attributeChangedCallback (name, oldval, newval) {
    super.attributeChangedCallback(name, oldval, newval)
    if (name === 'owner-filter') {
      this.load()
    }
  }

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