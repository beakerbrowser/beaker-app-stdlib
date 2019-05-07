import { html } from '../../../vendor/lit-element/lit-element.js'
import { repeat } from '../../../vendor/lit-element/lit-html/directives/repeat.js'
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

  get groups () {
    // this can be overridden
    return null
    // return [
    //   {label: 'Saved to your library', filterFn: r => r.saved},
    //   {label: 'Recently accessed', filterFn: r => !r.saved}
    // ]
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

  // rendering
  // =

  render() {
    return html`
      <link rel="stylesheet" href="${this.fontAwesomeCSSUrl}">
      ${this.hasHeadingLabels
        ? html`
          <div class="heading">
            ${repeat(this.columns, col => this.renderHeadingColumn(col))}
          </div>
        ` : ''}
      <div class="rows" @click=${this.onClickRows}>
        ${this.groups
          ? repeat(this.groups, group => this.renderGroup(group))
          : repeat(this.rows, row => this.getRowKey(row), row => this.renderRow(row))}
        ${this.rows.length === 0 ? this.renderEmpty() : ''}
      </div>
    `
  }

  renderGroup (group) {
    var rows = this.rows.filter(group.filterFn)
    if (rows.length === 0) return html``
    return html`
      <div class="group">
        ${group.label ? html`<div class="group-label">${group.label}</div>` : ''}
        <div class="group-rows">${repeat(rows, row => this.getRowKey(row), row => this.renderRow(row))}</div>
      </div>
    `
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
    if (/(rows|group|group-label)/.test(e.target.className)) {
      this.clearSelection()
    }
  }

  onContextmenuRow (e, row) {
    console.log(e)

    var items = this.buildContextMenuItems(row)
    if (!items) return

    e.preventDefault()
    e.stopPropagation()
    const isContextMenu = e.button === 2
    if (isContextMenu) this.setSelection(row)
    const style = `padding: 4px 0`
    const right = !isContextMenu
    contextMenu.create({x: e.clientX, y: e.clientY, items, style, right, noBorders: true, fontAwesomeCSSUrl: '/vendor/beaker-app-stdlib/css/fontawesome.css'})
  }
}
List.styles = [listCSS]
