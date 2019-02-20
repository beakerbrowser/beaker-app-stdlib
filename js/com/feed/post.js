import {LitElement, html} from '../../../vendor/lit-element/lit-element.js'
import feedPostCSS from '../../../css/com/feed/post.css.js'

export class FeedPost extends LitElement {
  render () {
    return html`
      <div class="avatar-column">
        <img class="avatar" src="/img/tmp-profile.png">
      </div>
      <div class="content-column">
        <div class="header">
          <a class="title" href="#">Paul Frazee</a>
          <a class="domain" href="#">pfrazee.com</a>
          &middot;
          <a class="permalink" href="#">1h</a>
        </div>
        <div class="body">Was I out of my head
Was I out of my mind?
How could I have forgotten to .bind
I ‘await’ed for an invocation
“this.load is undefined”</div>
      </div>
    `
  }
}
FeedPost.styles = feedPostCSS

customElements.define('beaker-feed-post', FeedPost)