import {LitElement, html} from '../../../vendor/lit-element/lit-element.js'
import feedPostCSS from '../../../css/com/feed/post.css.js'
import {timeDifference} from '../../time.js'
import '../reactions/reactions.js'

export class FeedPost extends LitElement {
  static get properties () {
    return {
      post: {type: Object},
      userUrl: {type: String, attribute: 'user-url'},
      viewProfileBaseUrl: {type: String, attribute: 'view-profile-base-url'}
    }
  }

  constructor () {
    super()
    this.post = null
    this.userUrl = ''
    this.viewProfileBaseUrl = 'intent:unwalled.garden/view-profile?url='
  }

  render () {
    if (!this.post) return
    var viewProfileUrl = `${this.viewProfileBaseUrl}${encodeURIComponent(this.post.author.url)}`
    return html`
      <div class="inner">
        <div class="avatar-column">
          <a href="${viewProfileUrl}"><img class="avatar" src="${this.post.author.url}/thumb"></a>
        </div>
        <div class="content-column">
          <div class="header">
            <a class="title" href="${viewProfileUrl}">${this.post.author.title}</a>
            &middot;
            <a class="permalink" href="${this.post.url}" target="_blank">${timeDifference(this.post.createdAt, true, '')}</a>
          </div>
          <div class="body">${this.post.content.body}</div>
          <beaker-reactions .reactions=${this.post.reactions} topic="${this.post.url}" user-url="${this.userUrl}"></beaker-reactions>
        </div>
      </div>
    `
  }
}
FeedPost.styles = feedPostCSS

customElements.define('beaker-feed-post', FeedPost)