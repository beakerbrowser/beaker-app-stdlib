import { html } from '../../../../vendor/lit-element/lit-element.js'
import { Explorer } from '../explorer.js'
import './list.js'

const postsAPI = navigator.importSystemAPI('unwalled-garden-posts')

export class PostsExplorer extends Explorer {
  constructor () {
    super()
    this.posts = []
    this.load()
  }

  // data management
  // =

  async load () {
    this.reset()
    this.safelyAccessListEl(el => el.clearSelection())

    this.posts = await postsAPI.query()
    console.log(this.posts)

    this.posts.forEach(post => { post.key = post.url })
    this.sort()
    this.requestUpdate()
  }

  sort (column = '', directionStr = '') {
    // current sort settings are maintained in the list, pull from there
    if (!column) column = this.safelyAccessListEl(el => el.sortColumn, 'createdAt')
    if (!directionStr) directionStr = this.safelyAccessListEl(el => el.sortDirection, 'asc')

    var direction = directionStr === 'asc' ? 1 : -1
    this.posts.sort((a, b) => {
      var v
      if (column === 'body') {
        v = a.content.body.localeCompare(b.content.body)
      } else if (column === 'author') {
        v = a.author.title.localeCompare(b.author.title)
      } else {
        v = b[column] - a[column]
      }
      return v * direction
    })
    this.requestUpdate()
  }

  // rendering
  // =

  renderList () {
    var posts = this.posts
    if (this.searchFilter) {
      posts = posts.filter(post => {
        if (post.content.body && post.content.body.toLowerCase().includes(this.searchFilter)) {
          return true
        }
        return false
      })
    }
    return html`
      <beaker-library-posts-list
        .rows=${posts}
        @sort=${this.onSort}
      ></beaker-library-posts-list>
    `
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
      return fn(this.shadowRoot.querySelector('beaker-library-posts-list'))
    } catch (e) {
      // ignore
      console.debug(e)
      return fallback
    }
  }
}

customElements.define('beaker-library-posts-explorer', PostsExplorer)