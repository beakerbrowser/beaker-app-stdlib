import { LitElement, html } from '../../../vendor/lit-element/lit-element.js'
import feedPostCSS from '../../../css/com/feed/post.css.js'
import { timeDifference } from '../../time.js'
import { findParent, emit } from '../../dom.js'
import { writeToClipboard } from '../../clipboard.js'
import { pluralize } from '../../strings.js'
import '../reactions/reactions.js'
import * as contextMenu from '../context-menu.js'
import * as toast from '../toast.js'

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
      <div class="inner">
        <div class="content-column">
          <div class="header">
            <a class="title" href="${viewProfileUrl}"><img class="avatar icon" src="asset:thumb:${this.post.author.url}"> ${this.post.author.title}</a>
            <a class="permalink" href="${viewRecordUrl}" target="_blank">${timeDifference(this.post.createdAt, true, 'ago')}</a>
            <button class="menu transparent" @click=${this.onClickMenu}><span class="fas fa-fw fa-ellipsis-h"></span></button>
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
            <a class="comments" href="#" @click=${this.onTopClick}>
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

  onClickMenu (e) {
    e.preventDefault()
    e.stopPropagation()

    var items = [
      {icon: 'far fa-fw fa-file-alt', label: 'View post file', click: () => window.open(this.post.url) },
      {icon: 'fas fa-fw fa-link', label: 'Copy post URL', click: () => {
        writeToClipboard(this.post.url)
        toast.create('Copied to your clipboard')
      }}
    ]

    if (this.userUrl === this.post.author.url) {
      items.push('-')
      items.push({icon: 'fas fa-fw fa-trash', label: 'Delete post', click: () => this.onClickDelete() })
    }

    var rect = e.currentTarget.getClientRects()[0]
    contextMenu.create({
      x: rect.right + 4,
      y: rect.bottom + 8,
      right: true,
      withTriangle: true,
      roomy: true,
      noBorders: true,
      fontAwesomeCSSUrl: '/vendor/beaker-app-stdlib/css/fontawesome.css',
      style: `padding: 4px 0`,
      items 
    })
  }

  onClickDelete () {
    if (!confirm('Are you sure?')) return
    emit(this, 'delete', {bubbles: true, composed: true, detail: {post: this.post}})
  }
}
FeedPost.styles = feedPostCSS

customElements.define('beaker-feed-post', FeedPost)