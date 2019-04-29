import { LitElement, html } from '../../../vendor/lit-element/lit-element.js'
import { repeat } from '../../../vendor/lit-element/lit-html/directives/repeat.js'
import explorerCSS from '../../../css/com/library/explorer.css.js'

export class Explorer extends LitElement {
  static get properties () {
    return {
      selectedKeys: {type: Array},
      searchFilter: {type: String}
    }
  }

  constructor () {
    super()
    this.selectedKeys = []
    this.searchFilter = ''
  }

  get viewPath () {
    // this should be overridden
    // return [
    //   {title: 'This', icon: 'fas fa-question', onClick() { alert('This should be overridden') }},
    //   {title: 'is', icon: 'fas fa-question', onClick() { alert('This should be overridden') }},
    //   {title: 'the', icon: 'fas fa-question', onClick() { alert('This should be overridden') }},
    //   {title: 'path', icon: 'fas fa-question', onClick() { alert('This should be overridden') }}
    // ]
    return null
  }

  // data management
  // =

  reset () {
    this.selectedKeys = []
    this.searchFilter = ''
  }

  // rendering
  // =

  render() {
    const hasPath = !!this.viewPath
    return html`
      <link rel="stylesheet" href="/vendor/beaker-app-stdlib/css/fontawesome.css">
      <div class="main">
        ${hasPath ? html`<div class="path">${this.renderPath()}</div>` : ''}
        <div class="toolbar">${this.renderToolbar()}</div>
        <div class="list ${hasPath ? 'with-path' : ''}" @selection-changed=${this.onSelectionChanged}>${this.renderList()}</div>
      </div>
      <div class="sidebar">
        ${this.renderSidebar()}
      </div>
    `
  }
  
  renderPath () {
    return html`
      ${repeat(this.viewPath, segment => html`<div @click=${segment.onClick} title="${segment.title}"><i class="${segment.icon}"></i> ${segment.title}</div>`)}
    `
  }

  renderToolbarButtons () {
    // this should be overridden
    return html``
  }
  
  renderToolbar () {
    return html`
      <div class="search-container">
        <input
          type="text"
          class="search"
          placeholder="Search"
          @keydown=${this.onKeydownSearch}
          @keyup=${this.onKeydownSearch}
        >
        <i class="fa fa-search"></i>
      </div>
      ${this.renderToolbarButtons()}
    `
  }
  
  renderList () {
    // this should be overridden
    return html``
  }
  
  renderSidebar () {
    if (this.selectedKeys.length === 0) return this.renderSidebarNoSelection()
    if (this.selectedKeys.length === 1) return this.renderSidebarOneSelection()
    return this.renderSidebarMultiSelection()
  }

  renderSidebarNoSelection () {
    // this should be overridden
    return html`<div></div>`
  }

  renderSidebarOneSelection () {
    // this should be overridden
    return html`<div></div>`
  }

  renderSidebarMultiSelection () {
    // this should be overridden
    return html`<div></div>`
  }

  // events
  // =

  onSelectionChanged (e) {
    this.selectedKeys = e.detail.keys
  }

  onKeydownSearch (e) {
    this.searchFilter = e.currentTarget.value
  }
}
Explorer.styles = [explorerCSS]
