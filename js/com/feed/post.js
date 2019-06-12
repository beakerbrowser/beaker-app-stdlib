import {LitElement, html} from '../../../vendor/lit-element/lit-element.js'
import feedPostCSS from '../../../css/com/feed/post.css.js'
import {timeDifference} from '../../time.js'
import '../reactions/reactions.js'

export class FeedPost extends LitElement {
  static get properties () {
    return {
      post: {type: Object},
      userUrl: {type: String, attribute: 'user-url'},
      viewProfileBaseUrl: {type: String, attribute: 'view-profile-base-url'},
      viewRecordBaseUrl: {type: String, attribute: 'view-record-base-url'}
    }
  }

  constructor () {
    super()
    this.post = null
    this.userUrl = ''
    this.viewProfileBaseUrl = 'intent:unwalled.garden/view-profile?url='
    this.viewRecordBaseUrl = 'intent:unwalled.garden/view-file?url='
  }

  render () {
    if (!this.post) return
    var viewProfileUrl = `${this.viewProfileBaseUrl}${encodeURIComponent(this.post.author.url)}`
    var viewRecordUrl = `${this.viewRecordBaseUrl}${encodeURIComponent(this.post.url)}`
    return html`
      <link rel="stylesheet" href="/vendor/beaker-app-stdlib/css/fontawesome.css">
      <div class="inner">
        <div class="content-column">
          <div class="header">
            <a class="title" href="${viewProfileUrl}"><img class="avatar icon" src="asset:thumb:${this.post.author.url}"> ${this.post.author.title}</a>
            <a class="permalink" href="${viewRecordUrl}" target="_blank">${timeDifference(this.post.createdAt, true, 'ago')}</a>
          </div>
          <div class="body">${this.post.body}</div>
          ${'reactions' in this.post
            ? html`
                <beaker-reactions
                  user-url="${this.userUrl}"
                  .reactions=${this.post.reactions}
                  topic="${this.post.url}"
                ></beaker-reactions>`
            : ''}
          ${'' /* TODO html`
            <div class="embed">
              <div class="embed-thumb">
                <img src="asset:thumb:dat://f12cadfff9d8389a95c361408d1b1869072fe10f8da5ba364078d40398a293e4">
              </div>
              <div class="embed-details">
                <div class="embed-title">Paul Frazee</div>
                <div class="embed-type"><i class="fas fa-file-alt"></i> Website</div>
                <div class="embed-description">The Beaker guy</div>
              </div>
          </div>`*/}
          <div class="footer">
            <a class="comments" href="#">0 comments</a>
          </div>
        </div>
      </div>
    `
  }
}
FeedPost.styles = feedPostCSS

customElements.define('beaker-feed-post', FeedPost)