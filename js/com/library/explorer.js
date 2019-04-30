import { LitElement, html } from '../../../vendor/lit-element/lit-element.js'
import { repeat } from '../../../vendor/lit-element/lit-html/directives/repeat.js'
import * as contextMenu from '../context-menu.js'
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
    this.iconsOnly = localStorage.getItem('toolbar-icons-only') === '1'
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

  renderToolbarButton (label, icon, onClick, disabled = false) {
    return html`
      <button ?disabled=${disabled} title="${label}" @click=${onClick}>
        <i class="${icon}"></i> ${this.iconsOnly ? '' : label}
      </button>
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
      <div class="spacer"></div>
      <div class="btn-group">
        <button @click=${this.onClickOptions}>
          <i class="fas fa-cog"></i>
          <i class="fas fa-angle-down"></i>
        </button>
      </div>
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

  onClickOptions (e) {
    e.stopPropagation()

    const setIconsOnly = v => e => {
      localStorage.setItem('toolbar-icons-only', v)
      this.iconsOnly = v === '1'
      this.requestUpdate()
    }

    var rect = e.currentTarget.getBoundingClientRect()
    contextMenu.create({
      x: rect.right,
      y: rect.bottom,
      items: [
        {icon: this.iconsOnly ? '' : 'fas fa-check', label: 'Icons and labels', click: setIconsOnly('0')},
        {icon: this.iconsOnly ? 'fas fa-check' : '', label: 'Icons only', click: setIconsOnly('1')},
      ],
      style: `padding: 4px 0`,
      noBorders: true,
      right: true,
      fontAwesomeCSSUrl: '/vendor/beaker-app-stdlib/css/fontawesome.css'
    })
  }
}
Explorer.styles = [explorerCSS]