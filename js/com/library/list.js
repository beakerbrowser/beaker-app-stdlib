import { Table } from '../table.js'
import * as contextMenu from '../context-menu.js'
import listCSS from '../../../css/com/library/list.css.js'
import { emit } from '../../dom.js'

export class List extends Table {
  static get properties() {
    return { 
      rows: {type: Array},
      selectedRows: {type: Object}
    }
  }

  constructor () {
    super()

    this.selectedRows = {}
  }

  getRowKey (row) {
    // all rows must define a .key property
    return row.key
  }

  isRowSelected (row) {
    return this.selectedRows[this.getRowKey(row)]
  }

  setSelection (row) {
    this.selectedRows = {[this.getRowKey(row)]: true}
    this.requestUpdate()
    var keys = Object.keys(this.selectedRows)
    emit(this, 'selection-changed', {detail: {keys}})
  }

  toggleSelection (row) {
    if (this.selectedRows[this.getRowKey(row)]) {
      delete this.selectedRows[this.getRowKey(row)]
    } else {
      this.selectedRows[this.getRowKey(row)] = true
    }
    this.requestUpdate()
    var keys = Object.keys(this.selectedRows)
    emit(this, 'selection-changed', {detail: {keys}})
  }

  clearSelection () {
    this.selectedRows = {}
    emit(this, 'selection-changed', {detail: {keys: []}})
  }

  sort () {
    emit(this, 'sort', {detail: {direction: this.sortDirection, column: this.sortColumn}})
    this.requestUpdate()
  }

  get fontAwesomeCSSUrl () {
    return '/vendor/beaker-app-stdlib/css/fontawesome.css'
  }

  buildContextMenuItems (row) {
    // this can be overridden
    return null
  }

  // events
  // =

  onClickRow (e, row) {
    if (e.metaKey) {
      this.toggleSelection(row)
    } else {
      this.setSelection(row)
    }
  }

  onClickRows (e) {
    if (e.target.classList.contains('rows')) {
      this.clearSelection()
    }
  }

  onContextmenuRow (e, row) {
    var items = this.buildContextMenuItems(row)
    if (!items) return

    e.preventDefault()
    this.setSelection(row)
    const style = `padding: 4px 0`
    contextMenu.create({x: e.clientX, y: e.clientY, items, style, noBorders: true, fontAwesomeCSSUrl: '/vendor/beaker-app-stdlib/css/fontawesome.css'})
  }
}
List.styles = [listCSS]
