import {LitElement, html} from '../../../vendor/lit-element/lit-element.js'
import feedPostCSS from '../../../css/com/feed/post.css.js'
import {toNiceDomain} from '../../strings.js'
import {timeDifference} from '../../time.js'

export class FeedPost extends LitElement {
  static get properties () {
    return {
      post: {type: Object}
    }
  }

  constructor () {
    super()
    this.post = null
  }

  render () {
    if (!this.post) return
    return html`
      <div class="avatar-column">
        <img class="avatar" src="${this.post.author.url}/thumb">
      </div>
      <div class="content-column">
        <div class="header">
          <a class="title" href="#">${this.post.author.title}</a>
          <a class="domain" href="#">${toNiceDomain(this.post.author.url)}</a>
          &middot;
          <a class="permalink" href="#">${timeDifference(this.post.createdAt, true, '')}</a>
        </div>
        <div class="body">${this.post.content.body}</div>
      </div>
    `
  }
}
FeedPost.styles = feedPostCSS

customElements.define('beaker-feed-post', FeedPost)