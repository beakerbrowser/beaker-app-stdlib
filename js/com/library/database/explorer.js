import { html } from '../../../../vendor/lit-element/lit-element.js'
import { Explorer } from '../explorer.js'
import { classMap } from '../../../../vendor/lit-element/lit-html/directives/class-map.js'
import { emit } from '../../../dom.js'
import './list.js'

const bookmarksAPI = navigator.importSystemAPI('bookmarks')
const postsAPI = navigator.importSystemAPI('unwalled-garden-posts')
const reactionsAPI = navigator.importSystemAPI('unwalled-garden-reactions')
const graphAPI = navigator.importSystemAPI('unwalled-garden-graph')

const DEFAULT_SORT_COLUMN = {
  bookmarks: 'createdAt',
  posts: 'createdAt',
  reactions: 'crawledAt',
  socialgraph: 'crawledAt'
}

const FILTER_FNS = {
  bookmarks: q => row => {
    if (row.title && row.title.toLowerCase().includes(q)) {
      return true
    } else if (row.href && row.href.toLowerCase().includes(q)) {
      return true
    }
    return false
  },
  posts: q => row => {
    if (row.content.body && row.content.body.toLowerCase().includes(q)) {
      return true
    }
    return false
  },
  reactions: q => row => {
    if (row.topic && row.topic.toLowerCase().includes(q)) {
      return true
    } else if (row.author.title && row.author.title.toLowerCase().includes(q)) {
      return true
    }
    return false
  },
  socialgraph: q => row => {
    if (row.type && row.type.toLowerCase().includes(q)) {
      return true
    } else if (row.src.title && row.src.title.toLowerCase().includes(q)) {
      return true
    } else if (row.dst.title && row.dst.title.toLowerCase().includes(q)) {
      return true
    }
    return false
  }
}

export class DatabaseExplorer extends Explorer {
  static get properties () {
    return {
      selectedKeys: {type: Array},
      searchFilter: {type: String},
      category: {type: String}
    }
  }

  constructor () {
    super()
    this.category = ''
    this.rows = []
  }

  // data management
  // =

  async load () {
    this.reset()
    this.safelyAccessListEl(el => el.clearSelection())

    switch (this.category) {
      case 'bookmarks':
        this.rows = await bookmarksAPI.query()
        this.rows.forEach(row => { row.key = row.record ? row.record.url : row.href })
        break
      case 'posts':
        this.rows = await postsAPI.query()
        this.rows.forEach(row => { row.key = row.url })
        break
      case 'reactions':
        this.rows = await reactionsAPI.query()
        this.rows.forEach(row => { row.key = row.record.url })
        break
      case 'socialgraph':
        this.rows = await graphAPI.query()
        this.rows.forEach(row => { row.key = `${row.src.url}:${row.type}:${row.dst.url}` })
        break
    }
    console.log(this.rows)
    
    this.sort() // this will request update
    this.requestUpdate()
  }

  sort (column = '', directionStr = '') {
    // current sort settings are maintained in the list, pull from there
    if (!column) column = this.safelyAccessListEl(el => el.sortColumn, DEFAULT_SORT_COLUMN[this.category])
    if (!directionStr) directionStr = this.safelyAccessListEl(el => el.sortDirection, 'asc')

    var direction = directionStr === 'asc' ? 1 : -1
    this.rows.sort((a, b) => {
      var v
      switch (this.category) {
        case 'bookmarks':
          if (column === 'author') {
            v = a.author.title.localeCompare(b.author.title)
          }
          break
        case 'posts':
          if (column === 'body') {
            v = a.content.body.localeCompare(b.content.body)
          } else if (column === 'author') {
            v = a.author.title.localeCompare(b.author.title)
          }
          break
        case 'reactions':
          if (column === 'author') {
            v = a.author.title.localeCompare(b.author.title)
          }
          break
        case 'socialgraph':
          if (column === 'src') {
            v = a.src.title.localeCompare(b.src.title)
          } else if (column === 'dst') {
            v = a.dst.title.localeCompare(b.dst.title)
          }
          break
      }
      if (!v) {
        if (Array.isArray(a[column])) {
          v = a[column].join('').localeCompare(b[column].join(''))
        } else if (typeof a[column] === 'string') {
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

  renderHeader () {
    return html`<h2><i class="fas fa-database"></i> Database</h2>`
  }

  renderList () {
    var rows = this.rows
    console.log('rendering list', this.category, rows)
    if (this.searchFilter) {
      rows = rows.filter(FILTER_FNS[this.category](this.searchFilter))
    }
    return html`
      <beaker-library-database-list
        .rows=${rows}
        category="${this.category}"
        @sort=${this.onSort}
      ></beaker-library-database-list>
    `
  }

  renderToolbarDatabaseButtons (current) {
    const item = (id, label) => {
      const cls = classMap({pressed: id === current, radio: true})
      return html`<button class="${cls}" @click=${e => { emit(this, 'change-location', {detail: {view: 'database', category: id}}) }}>${label}</button>`
    }
    return html`
      <div class="radio-group">
        ${item('bookmarks', 'Bookmarks')}
        ${item('posts', 'Posts')}
        ${item('reactions', 'Reactions')}
        ${item('socialgraph', 'Social graph')}
      </div>
    `
  }

  renderToolbar () {
    return html`
      ${this.renderToolbarDatabaseButtons(this.category)}
      <div class="spacer"></div>
      ${this.renderToolbarSearch()}
    `
  }

  // events
  // =

  onSort (e) {
    this.sort(e.detail.column, e.detail.direction)
  }

  // helpers
  // =

  attributeChangedCallback (name, oldval, newval) {
    if (name === 'category') {
      this.rows = []
    }
    super.attributeChangedCallback(name, oldval, newval)
    if (name === 'category') {
      this.load()
    }
  }

  safelyAccessListEl (fn, fallback = undefined) {
    try {
      return fn(this.shadowRoot.querySelector('beaker-library-database-list'))
    } catch (e) {
      // ignore
      console.debug(e)
      return fallback
    }
  }
}

customElements.define('beaker-library-database-explorer', DatabaseExplorer)