import {LitElement, html} from '../../../vendor/lit-element/lit-element.js'
import {repeat} from '../../../vendor/lit-element/lit-html/directives/repeat.js'
import {classMap} from '../../../vendor/lit-element/lit-html/directives/class-map.js'
import {unsafeHTML} from '../../../vendor/lit-element/lit-html/directives/unsafe-html.js'
import {toDomain, highlightSearchResult} from '../../strings.js'
import searchCSS from '../../../css/com/app-header/search.css.js'

const search = navigator.importSystemAPI('search') // TODO replace with an import from dat://beakerbrowser.com

export class AppHeaderSearch extends LitElement {
  static get properties () {
    return {
      fontawesomeSrc: {type: String, attribute: 'fontawesome-src'},
      isFocused: {type: Boolean},
      query: {type: String},
      results: {type: Array},
      highlightNonce: {type: String},
      highlighted: {type: Number}
    }
  }

  constructor () {
    super()
    this.fontawesomeSrc = ''
    this.isFocused = false
    this.query = ''
    this.results = null
    this.highlightNonce = null
    this.highlighted = 0

    this.$onClickDocument = this.onClickDocument.bind(this)
  }

  async runQuery () {
    var queryAtTimeOfRun = this.query
    var res = await search.query({
      query: this.query,
      filters: {
        datasets: 'sites'
      },
      limit: 6
    })
    
    if (queryAtTimeOfRun !== this.query) {
      // user changed query while we were running, discard
      console.log('Discarding results from outdated query')
      return
    }

    // add the "run search" item
    res.results.push({theFixedSearchItem: true})

    this.highlighted = 0
    this.results = res.results
    this.highlightNonce = res.highlightNonce
  }

  getResultUrl (res) {
    if (res.theFixedSearchItem) {
      return `dat://search/?q=${encodeURIComponent(this.query)}`
    }
    return `dat://profile/${toDomain(res.url)}`
  }

  // rendering
  // =

  render () {
    return html`
      <link rel="stylesheet" href="${this.fontawesomeSrc}">
      <div class="search-container">
        <input
          type="text"
          class="search"
          placeholder="Search"
          value="${this.query}"
          @keydown=${this.onKeydownInput}
          @keyup=${this.onKeyupInput}
          @focus=${this.onFocusInput}
        >
        <i class="fa fa-search"></i>
        ${this.renderResults()}
      </div>
    `
  }

  renderResults () {
    if (!this.results || !this.isFocused) {
      return ''
    }
    return html`
      <div class="search-results autocomplete-results">
        ${repeat(this.results, (res, i) => this.renderResult(res, i))}
      </div>
    `
  }

  renderResult (res, i) {
    const cls = classMap({
      'autocomplete-result': true,
      'search-result': true,
      active: i === this.highlighted
    })
    if (res.theFixedSearchItem) {
      return html`
        <a href="${this.getResultUrl(res)}" class="${cls}">
          <i class="icon fas fa-search"></i>
          <span class="title">Search for "${this.query}"</span>
        </a>
      `
    }
    return html`
      <a href="${this.getResultUrl(res)}" class="${cls}">
        <img class="icon favicon" src="beaker-favicon:32,${res.url}"/>
        <span class="title">${unsafeHTML(highlightSearchResult(res.title, this.highlightNonce))}</span>
        <span class="label">${unsafeHTML(highlightSearchResult(res.description, this.highlightNonce))}</span>
      </a>
    `
  }

  // events
  // =

  unfocus () {
    this.isFocused = false

    var input = this.shadowRoot.querySelector('input')
    if (input.matches(':focus')) {
      input.blur()
    }

    document.removeEventListener('click', this.$onClickDocument)
  }

  onKeydownInput (e) {
    if (e.key === 'Enter') {
      let res = this.results[this.highlighted]
      if (res) {
        window.location = this.getResultUrl(res)
      }
      return
    }
    if (e.key === 'Escape') {
      return this.unfocus()
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      this.highlighted = Math.max(this.highlighted - 1, 0)
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      this.highlighted = Math.min(this.highlighted + 1, this.results.length)
    }
  }

  onKeyupInput (e) {
    if (this.query !== e.currentTarget.value) {
      this.query = e.currentTarget.value
      this.runQuery()
    }
  }

  onFocusInput (e) {
    this.isFocused = true
    document.addEventListener('click', this.$onClickDocument)
  }

  onClickDocument (e) {
    // is the click inside us?
    for (let el of e.path) {
      if (el === this) return
    }
    // no, unfocus
    this.unfocus()
  }
}
AppHeaderSearch.styles = searchCSS

customElements.define('beaker-app-header-search', AppHeaderSearch)