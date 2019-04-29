import { html } from '../../../../vendor/lit-element/lit-element.js'
import { Explorer } from '../explorer.js'
import './list.js'

const graphAPI = navigator.importSystemAPI('unwalled-garden-graph')

export class SocialgraphExplorer extends Explorer {
  constructor () {
    super()
    this.links = []
    this.load()
  }

  // data management
  // =

  async load () {
    this.reset()
    this.safelyAccessListEl(el => el.clearSelection())

    this.links = await graphAPI.query()
    console.log(this.links)

    this.links.forEach(link => { link.key = `${link.src.url}:${link.type}:${link.dst.url}` })
    this.sort()
    this.requestUpdate()
  }

  sort (column = '', directionStr = '') {
    // current sort settings are maintained in the list, pull from there
    if (!column) column = this.safelyAccessListEl(el => el.sortColumn, 'crawledAt')
    if (!directionStr) directionStr = this.safelyAccessListEl(el => el.sortDirection, 'asc')

    var direction = directionStr === 'asc' ? 1 : -1
    this.links.sort((a, b) => {
      var v
      if (column === 'src') {
        v = a.src.title.localeCompare(b.src.title)
      } else if (column === 'dst') {
        v = a.dst.title.localeCompare(b.dst.title)
      } else {
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

  renderList () {
    var links = this.links
    if (this.searchFilter) {
      links = links.filter(link => {
        if (link.type && link.type.toLowerCase().includes(this.searchFilter)) {
          return true
        } else if (link.src.title && link.src.title.toLowerCase().includes(this.searchFilter)) {
          return true
        } else if (link.dst.title && link.dst.title.toLowerCase().includes(this.searchFilter)) {
          return true
        }
        return false
      })
    }
    return html`
      <beaker-library-socialgraph-list
        .rows=${links}
        @sort=${this.onSort}
      ></beaker-library-socialgraph-list>
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
      return fn(this.shadowRoot.querySelector('beaker-library-socialgraph-list'))
    } catch (e) {
      // ignore
      console.debug(e)
      return fallback
    }
  }
}

customElements.define('beaker-library-socialgraph-explorer', SocialgraphExplorer)