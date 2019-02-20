import {LitElement, html} from '../../../vendor/lit-element/lit-element.js'
import {classMap} from '../../../vendor/lit-element/lit-html/directives/class-map.js'
import feedComposerCSS from '../../../css/com/feed/composer.css.js'

const CHAR_LIMIT = 280

export class FeedComposer extends LitElement {
  static get properties () {
    return {
      isFocused: {type: Boolean},
      draftText: {type: String}
    }
  }

  constructor () {
    super()
    this.isFocused = false
    this.draftText = ''
  }

  // rendering
  // =

  render () {
    if (this.isFocused || this.draftText) {
      return this.renderActive()
    }
    return this.renderInactive()
  }

  renderInactive () {
    return html`
      <div class="input-placeholder" @click=${this.onClickPlaceholder}>
        What's on your mind?
      </div>
    `
  }

  renderActive () {
    const charCountCls = classMap({
      'char-count': true,
      danger: this.draftText.length > (CHAR_LIMIT - 15)
    })
    return html`
      <textarea
        placeholder="What's on your mind?"
        @keydown=${this.onChangeTextarea}
        @keyup=${this.onChangeTextarea}
        @blur=${this.onBlurTextarea}
      >${this.draftText}</textarea>
      <div class="actions">
        <span class="${charCountCls}">${this.draftText.length} / ${CHAR_LIMIT}</span>
        <button class="btn primary" ?disabled=${this.draftText.length === 0}>Post</button>
      </div>
    `
  }

  // events
  // =

  async onClickPlaceholder () {
    this.isFocused = true

    // focus after update
    await this.updateComplete
    this.shadowRoot.querySelector('textarea').focus()
  }

  onChangeTextarea (e) {
    if (e.currentTarget.value.length > CHAR_LIMIT) {
      this.draftText = e.currentTarget.value = e.currentTarget.value.slice(0, CHAR_LIMIT)
      e.preventDefault()
      return
    }
    this.draftText = e.currentTarget.value
  }

  onBlurTextarea () {
    this.isFocused = false
  }
}
FeedComposer.styles = feedComposerCSS

customElements.define('beaker-feed-composer', FeedComposer)