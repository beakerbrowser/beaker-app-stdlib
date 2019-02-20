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
    var authorDomain = (new URL(this.post.author.url)).hostname
    return html`
      <div class="avatar-column">
        <img class="avatar" src="${this.post.author.url}/thumb">
      </div>
      <div class="content-column">
        <div class="header">
          <a class="title" href="dat://profile/${authorDomain}">${this.post.author.title}</a>
          <a class="domain" href="dat://profile/${authorDomain}">${toNiceDomain(this.post.author.url)}</a>
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