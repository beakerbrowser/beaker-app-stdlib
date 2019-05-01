import { html } from '../../../../vendor/lit-element/lit-element.js'
import { List } from '../list.js'
import { shortDate } from '../../../time.js'

export class SocialgraphList extends List {
  constructor () {
    super()
    this.sortColumn = 'crawledAt'
  }

  get columns () {
    return [
      {id: 'src', label: 'Source', flex: 1, renderer: 'renderSrc'},
      {id: 'type', label: 'Edge', width: 150, renderer: 'renderType'},
      {id: 'dst', label: 'Destination', flex: 1, renderer: 'renderDst'},
      {id: 'crawledAt', label: 'Date Indexed', width: 100, renderer: 'renderCrawledAt'}
    ]
  }

  // rendering
  // =

  renderCrawledAt (row) {
    return shortDate(row.crawledAt)
  }

  renderSrc (row) {
    return html`<div class="site">
      <span>${row.src.title}</span>
    </div>`
  }

  renderDst (row) {
    return html`<div class="site">
      <span>${row.dst.title}</span>
    </div>`
  }

  renderType (row) {
    if (row.type === 'unwalled.garden/follows') {
      return 'Follows'
    }
    return row.type
  }

  // events
  // =

  onDblclickRow (e, row) {
    alert(row.name)
  }
}

customElements.define('beaker-library-socialgraph-list', SocialgraphList)