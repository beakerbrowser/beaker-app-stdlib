import { LitElement, html } from '../../../vendor/lit-element/lit-element.js'
import feedPostCSS from '../../../css/com/feed/post.css.js'
import { timeDifference } from '../../time.js'
import { findParent, emit } from '../../dom.js'
import { pluralize } from '../../strings.js'
import '../reactions/reactions.js'

const RENDER_LIMIT = 280

export class FeedPost extends LitElement {
  static get properties () {
    return {
      post: {type: Object},
      userUrl: {type: String, attribute: 'user-url'},
      expanded: {type: Boolean},
      viewProfileBaseUrl: {type: String, attribute: 'view-profile-base-url'},
      viewRecordBaseUrl: {type: String, attribute: 'view-record-base-url'}
    }
  }

  constructor () {
    super()
    this.post = null
    this.userUrl = ''
    this.expanded = false
    this.viewProfileBaseUrl = ''
    this.viewRecordBaseUrl = ''
  }

  get isTooLong () {
    return !this.expanded && this.post.body.length > RENDER_LIMIT
  }

  render () {
    if (!this.post || !this.post.body) return
    var viewProfileUrl = this.viewProfileBaseUrl ? `${this.viewProfileBaseUrl}${encodeURIComponent(this.post.author.url)}` : this.post.author.url
    var viewRecordUrl = this.viewRecordBaseUrl ? `${this.viewRecordBaseUrl}${encodeURIComponent(this.post.url)}` : this.post.url
    var body = this.expanded ? this.post.body : this.post.body.slice(0, RENDER_LIMIT)
    return html`
      <link rel="stylesheet" href="/vendor/beaker-app-stdlib/css/fontawesome.css">
      <div class="inner" @click=${this.onTopClick}>
        <div class="content-column">
          <div class="header">
            <a class="title" href="${viewProfileUrl}"><img class="avatar icon" src="asset:thumb:${this.post.author.url}"> ${this.post.author.title}</a>
            <a class="permalink" href="${viewRecordUrl}" target="_blank">${timeDifference(this.post.createdAt, true, 'ago')}</a>
          </div>
          <div class="body">${body}${this.isTooLong ? '...' : ''}</div>
          ${this.isTooLong ? html`<a class="readmore" href="#" @click=${this.onTopClick}>Read more</a>` : ''}
          ${''/* TODO <div class="embed">
            <div class="embed-thumb">
              <img src="asset:thumb:dat://f12cadfff9d8389a95c361408d1b1869072fe10f8da5ba364078d40398a293e4">
            </div>
            <div class="embed-details">
              <div class="embed-title">Paul Frazee</div>
              <div class="embed-type"><i class="fas fa-file-alt"></i> Website</div>
              <div class="embed-description">The Beaker guy</div>
          </div>*/}
          <div class="footer">
            ${'reactions' in this.post
              ? html`
                  <beaker-reactions
                    user-url="${this.userUrl}"
                    .reactions=${this.post.reactions}
                    topic="${this.post.url}"
                  ></beaker-reactions>`
              : ''}
            <a class="comments" @click=${this.onTopClick}>
              ${this.post.numComments}
              ${pluralize(this.post.numComments, 'comment')}
            </a>
          </div>
        </div>
      </div>
    `
  }

  // events
  // =

  onTopClick (e) {
    // make sure this wasn't a click on a link within the post
    if (findParent(e.target, el => el.tagName === 'A' || el === e.currentTarget) !== e.currentTarget) {
      return
    }    
    emit(this, 'expand', {bubbles: true, composed: true, detail: {post: this.post}})
  }
}
FeedPost.styles = feedPostCSS

customElements.define('beaker-feed-post', FeedPost)