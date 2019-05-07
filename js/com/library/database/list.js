import { html } from '../../../../vendor/lit-element/lit-element.js'
import { List } from '../list.js'
import { shortDate } from '../../../time.js'

export class DatabaseList extends List {
  static get properties() {
    return { 
      rows: {type: Array},
      selectedRows: {type: Object},
      category: {type: String}
    }
  }

  constructor () {
    super()
    this.category = ''
  }

  get columns () {
    switch (this.category) {
      case 'bookmarks':
        return [
          {id: 'author', label: 'Author', width: 120, renderer: 'renderAuthor'},
          {id: 'title', label: 'Title', flex: 1},
          {id: 'href', label: 'Location', flex: 1},
          {id: 'createdAt', label: 'Date Published', width: 80, renderer: 'renderCreatedAt'}
        ]
      case 'posts':
        return [
          {id: 'author', label: 'Author', width: 120, renderer: 'renderAuthor'},
          {id: 'body', label: 'Post', flex: 1, renderer: 'renderPostBody'},
          {id: 'createdAt', label: 'Date Published', width: 80, renderer: 'renderCreatedAt'}
        ]
      case 'reactions':
        return [
          {id: 'author', label: 'Author', width: 120, renderer: 'renderAuthor'},
          {id: 'emojis', label: 'Reactions', width: 100, renderer: 'renderReactionEmojis'},
          {id: 'topic', label: 'Topic', flex: 1},
          {id: 'crawledAt', label: 'Date Indexed', width: 80, renderer: 'renderCrawledAt'},
        ]
      case 'socialgraph':
        return [
          {id: 'src', label: 'Source', width: 120, renderer: 'renderSocialgraphSrc'},
          {id: 'type', label: 'Edge', width: 120, renderer: 'renderSocialgraphType'},
          {id: 'dst', label: 'Destination', flex: 1, renderer: 'renderSocialgraphDst'},
          {id: 'crawledAt', label: 'Date Indexed', width: 80, renderer: 'renderCrawledAt'}
        ]
    }
    return []
  }

  // rendering
  // =

  renderCreatedAt (row) {
    return shortDate(row.createdAt)
  }

  renderCrawledAt (row) {
    return shortDate(row.crawledAt)
  }

  renderAuthor (row) {
    return html`<div class="site">
      <span>${row.author.title}</span>
    </div>`
  }

  renderPostBody (row) {
    return row.content.body
  }

  renderSocialgraphSrc (row) {
    return html`<div class="site">
      <span>${row.src.title}</span>
    </div>`
  }

  renderReactionEmojis (row) {
    return row.emojis.join('')
  }

  renderSocialgraphDst (row) {
    return html`<div class="site">
      <span>${row.dst.title}</span>
    </div>`
  }

  renderSocialgraphType (row) {
    if (row.type === 'unwalled.garden/follows') {
      return 'Follows'
    }
    return row.type
  }

  // events
  // =

}

customElements.define('beaker-library-database-list', DatabaseList)