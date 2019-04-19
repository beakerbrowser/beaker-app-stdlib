/* globals beaker */
import { html, css } from '../../../vendor/lit-element/lit-element.js'
import { BasePopup } from './base.js'
import popupsCSS from '../../../css/com/popups.css.js'
import { writeToClipboard } from '../../clipboard.js'
import * as contextMenu from '../context-menu.js'
import * as toast from '../toast.js'
const profiles = navigator.importSystemAPI('profiles')
const bookmarks = navigator.importSystemAPI('bookmarks')

// exported api
// =

export class AddPinnedBookmarkPopup extends BasePopup {
  static get properties () {
    return {
      suggestions: {type: Object}
    }
  }

  constructor () {
    super()
    this.user = null
    this.suggestions = {}
    this.query = ''
    this.isURLFocused = false

    this.initialLoad()
  }

  // management
  //

  static async create () {
    return BasePopup.create(AddPinnedBookmarkPopup)
  }

  static destroy () {
    return BasePopup.destroy('beaker-add-pinned-bookmark-popup')
  }

  async initialLoad () {
    this.user = await profiles.getCurrentUser()
    await this.loadSuggestions()
  }

  async loadSuggestions () {
    this.suggestions = await beaker.crawler.listSuggestions(this.user.url, this.query)
    console.log(this.query, this.suggestions)
  }

  // rendering
  // =

  renderTitle () {
    return 'Pin to start page'
  }

  renderBody () {
    var hasResults = !this.query || (Object.values(this.suggestions).filter(arr => arr.length > 0).length > 0)
    return html`  
      <div class="filter-control">
        <input type="text" id="search-input" name="url" placeholder="Search" @input=${this.onFocusSearch} @keyup=${e => delay(this.onChangeQuery.bind(this), e)} />
      </div>
      <div class="suggestions ${this.query ? 'query-results' : 'defaults'}">
        ${hasResults ? '' : html`<div class="empty">No results</div>`}
        ${this.renderSuggestionGroup('builtins', 'Applications')}
        ${this.renderSuggestionGroup('addressbook', 'Address book', true)}
        ${this.renderSuggestionGroup('bookmarks', 'Bookmarks')}
        ${this.renderSuggestionGroup('websites', 'Websites')}
        ${this.renderSuggestionGroup('history', 'History')}
      </div>
    `
  }

  renderSuggestionGroup (key, label, useThumb = false) {
    var group = this.suggestions[key]
    if (!group || !group.length) return ''
    return html`
      <div class="group">
        <div class="group-title">${label}</div>
        <div class="group-items">${group.map(g => this.renderSuggestion(g, useThumb))}</div>
      </div>`
  }
  
  renderSuggestion (row, useThumb) {
    var title = row.title || 'Untitled'
    return html`
      <a href=${row.url} class="suggestion" title=${title} @click=${this.onClick} @contextmenu=${this.onContextMenu}>
        <img class="${useThumb ? 'rounded' : ''} favicon" src="${useThumb ? `${row.url}/thumb` : `beaker-favicon:32,${row.url}`}"/>
        <span class="title">${this.query ? title : trunc(title, 15)}</span>
        ${this.query ? html`<span class="url">${row.url}</span>` : ''}
      </a>
    `
  }

  firstUpdated () {
    this.shadowRoot.querySelector('input').focus()
  }
  
  // events
  // =

  onFocusSearch () {
    if (!this.isURLFocused) {
      this.isURLFocused = true
    }
  }
  
  async onChangeQuery (e) {
    this.query = this.shadowRoot.querySelector('input').value
    this.loadSuggestions()
  }

  async pin (url, title) {
    if (!(await bookmarks.has(url))) {
      await bookmarks.add({href: url, title: title, pinned: true, isPublic: false})
    } else {
      await bookmarks.edit(url, {pinned: true})
    }
    toast.create('Pinned to your start page')
  }

  async onClick (e) {
    e.preventDefault()
    await this.pin(e.currentTarget.getAttribute('href'), e.currentTarget.getAttribute('title'))
    this.dispatchEvent(new CustomEvent('resolve'))
  }
    
  onContextMenu (e) {
    e.preventDefault()
    var url = e.currentTarget.getAttribute('href')
    const items = [
      {icon: 'fa fa-external-link-alt', label: 'Open Link in New Tab', click: () => window.open(url)},
      {icon: 'fa fa-link', label: 'Copy Link Address', click: () => writeToClipboard(url)}
    ]
    contextMenu.create({x: e.clientX, y: e.clientY, items, fontAwesomeCSSUrl: '/vendor/beaker-app-stdlib/css/fontawesome.css'})
  }
}
AddPinnedBookmarkPopup.styles = [popupsCSS, css`
.popup-inner {
  width: 80vw;
  max-width: 900px;
  min-width: 600px;
}

.filter-control input {
  height: 26px;
  margin: 0;
  width: 100%;
}

.suggestions {
  overflow-y: auto;
  max-height: calc(100vh - 200px);
  padding: 0 10px;
}

.empty {
  color: rgba(0, 0, 0, 0.5);
}

.group {
  padding: 0 0 20px;
}

.group-title {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.5);
  margin-bottom: 10px;
  padding-bottom: 2px;
  padding-left: 2px;
  letter-spacing: -0.5px;
}

.suggestion {
  display: flex;
  align-items: center;
  padding: 10px;
  overflow: hidden;
  user-select: none;
}

.suggestion .favicon {
  width: 32px;
  height: 32px;
}

.suggestion .favicon.rounded {
  border-radius: 50%;
  object-fit: cover;
}

.suggestion .title,
.suggestion .url {
  white-space: nowrap;
  font-size: 12px;
}

.suggestion .url {
  margin-left: 10px;
  color: gray;
}

.suggestion:hover {
  background: #eee;
}

.suggestions.defaults .group-items {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
}

@media (min-width: 1300px) {
  .suggestions.defaults .group-items {
    grid-template-columns: repeat(8, 1fr);
  }
}

.suggestions.defaults .suggestion {
  flex-direction: column;
}

.suggestions.defaults .suggestion .favicon {
  margin-bottom: 6px;
}

.suggestions.query-results .suggestion .favicon {
  margin-right: 10px;
}
`]

customElements.define('beaker-add-pinned-bookmark-popup', AddPinnedBookmarkPopup)


// helpers
// =

function trunc (str, n) {
  if (str && str.length > n) {
    str = str.slice(0, n - 3) + '...'
  }
  return str
}

function delay (cb, param) {
  window.clearTimeout(cb)
  setTimeout(cb, 150, param)
}
