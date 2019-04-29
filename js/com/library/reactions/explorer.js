import { html } from '../../../../vendor/lit-element/lit-element.js'
import { Explorer } from '../explorer.js'
import './list.js'

const reactionsAPI = navigator.importSystemAPI('unwalled-garden-reactions')

export class ReactionsExplorer extends Explorer {
  constructor () {
    super()
    this.reactions = []
    this.load()
  }


  // data management
  // =

  async load () {
    this.reset()
    this.safelyAccessListEl(el => el.clearSelection())

    this.reactions = await reactionsAPI.query()
    console.log(this.reactions)

    this.reactions.forEach(reaction => { reaction.key = reaction.record.url })
    this.sort()
    this.requestUpdate()
  }

  sort (column = '', directionStr = '') {
    // current sort settings are maintained in the list, pull from there
    if (!column) column = this.safelyAccessListEl(el => el.sortColumn, 'crawledAt')
    if (!directionStr) directionStr = this.safelyAccessListEl(el => el.sortDirection, 'asc')

    var direction = directionStr === 'asc' ? 1 : -1
    this.reactions.sort((a, b) => {
      var v
      if (column === 'author') {
        v = a.author.title.localeCompare(b.author.title)
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
    var reactions = this.reactions
    if (this.searchFilter) {
      reactions = reactions.filter(reaction => {
        if (reaction.topic && reaction.topic.toLowerCase().includes(this.searchFilter)) {
          return true
        } else if (reaction.author.title && reaction.author.title.toLowerCase().includes(this.searchFilter)) {
          return true
        }
        return false
      })
    }
    return html`
      <beaker-library-reactions-list
        .rows=${reactions}
        @sort=${this.onSort}
      ></beaker-library-reactions-list>
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
      return fn(this.shadowRoot.querySelector('beaker-library-reactions-list'))
    } catch (e) {
      // ignore
      console.debug(e)
      return fallback
    }
  }
}

customElements.define('beaker-library-reactions-explorer', ReactionsExplorer)