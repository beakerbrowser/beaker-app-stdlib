import { html } from '../../../../vendor/lit-element/lit-element.js'
import { List } from '../list.js'
import { shortDate } from '../../../time.js'

export class ReactionsList extends List {
  constructor () {
    super()
    this.sortColumn = 'crawledAt'
  }

  get columns () {
    return [
      {id: 'emojis', label: 'Reactions', width: 100, renderer: 'renderEmojis'},
      {id: 'topic', label: 'Topic', flex: 1},
      {id: 'crawledAt', label: 'Date Indexed', width: 120, renderer: 'renderCrawledAt'},
      {id: 'author', label: 'Author', width: 120, renderer: 'renderAuthor'}
    ]
  }

  // rendering
  // =

  renderEmojis (row) {
    return row.emojis.join('')
  }

  renderCrawledAt (row) {
    return shortDate(row.crawledAt)
  }

  renderAuthor (row) {
    return html`<div class="site">
      <img src="asset:thumb:${row.author.url}">
      <span>${row.author.title}</span>
    </div>`
  }

  // events
  // =

  onDblclickRow (e, row) {
    window.open(row.topic)
  }
}

customElements.define('beaker-library-reactions-list', ReactionsList)