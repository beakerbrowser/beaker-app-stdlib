import { LitElement, html } from '../../../vendor/lit-element/lit-element.js'
import { classMap } from '../../../vendor/lit-element/lit-html/directives/class-map.js'
import { ReactionPicker } from './picker.js'
import { renderSafe as renderEmoji } from '../../emoji.js'

export class Reactions extends LitElement {
  static get properties () {
    return {
      reactions: {type: Object},
      userUrl: {type: String, attribute: 'user-url'},
      topic: {type: String}
    }
  }

  constructor () {
    super()
    this.reactions = []
    this.userUrl = ''
    this.topic = ''
  }

  createRenderRoot () {
    // dont use the shadow dom
    // this enables the post's hover state to hide/show the add button
    return this
  }

  render () {
    return html`
      ${this.reactions.map(r => {
        var alreadySet = !!r.authors.find(a => a.url === this.userUrl)
        var cls = classMap({reaction: true, 'by-user': alreadySet})
        return html`
          <span class="${cls}" @click=${e => this.emitChange(alreadySet, r.emoji)}>
            ${renderEmoji(r.emoji)}
            <span class="count">${r.authors.length}</span>
          </span>
        `
      })}
      <span class="reaction add-btn" @click=${this.onClickAddBtn}>
        +
      </span>
    `
  }

  // events
  // =

  emitChange (alreadySet, emoji) {
    if (alreadySet) this.emitRemove(emoji)
    if (!alreadySet) this.emitAdd(emoji)
  }

  emitAdd (emoji) {
    this.dispatchEvent(new CustomEvent('add-reaction', {bubbles: true, composed: true, detail: {topic: this.topic, emoji}}))

    // optimistic update UI
    var author = {url: this.userUrl, title: 'You'}
    var reaction = this.reactions.find(r => r.emoji === emoji)
    if (reaction) reaction.authors.push(author)
    else this.reactions.push({emoji, authors: [author]})
    this.requestUpdate()
  }

  emitRemove (emoji) {
    this.dispatchEvent(new CustomEvent('delete-reaction', {bubbles: true, composed: true, detail: {topic: this.topic, emoji}}))
    
    // optimistic update UI
    var reaction = this.reactions.find(r => r.emoji === emoji)
    if (reaction) reaction.authors = reaction.authors.filter(author => author.url !== this.userUrl)
    this.requestUpdate()
  }

  async onClickAddBtn (e) {
    e.preventDefault()
    e.stopPropagation()

    var el = e.currentTarget
    el.classList.add('pressed')
    try {
      var rect = offset(el)
      if (rect.top + 400 > document.body.scrollHeight) {
        rect.top -= 300
      }
      var emoji = await ReactionPicker.create({
        left: rect.right + 5,
        top: rect.top
      })
      this.emitAdd(emoji)
    } catch (e) {

    }
    el.classList.remove('pressed')
  }
}

customElements.define('beaker-reactions', Reactions)

// helpers
//-

function offset (el) {
  var rect = el.getBoundingClientRect(),
  scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
  scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft, right: rect.right + scrollLeft, bottom: rect.bottom + scrollTop }
}