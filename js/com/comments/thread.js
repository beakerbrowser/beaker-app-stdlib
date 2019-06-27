import { LitElement, html } from '../../../vendor/lit-element/lit-element.js'
import { repeat } from '../../../vendor/lit-element/lit-html/directives/repeat.js'
import commentsThreadCSS from '../../../css/com/comments/thread.css.js'
import { timeDifference } from '../../time.js'
import { emit } from '../../dom.js'
import './composer.js'
import '../reactions/reactions.js'

export class CommentsThread extends LitElement {
  static get properties () {
    return {
      comments: {type: Array},
      topicUrl: {type: String, attribute: 'topic-url'},
      userUrl: {type: String, attribute: 'user-url'},
      activeReplies: {type: Object}
    }
  }

  constructor () {
    super()
    this.comments = null
    this.topicUrl = ''
    this.userUrl = ''
    this.activeReplies = {}
  }

  render () {
    return html`
      <link rel="stylesheet" href="/vendor/beaker-app-stdlib/css/fontawesome.css">
      <beaker-comment-composer topic="${this.topicUrl}"></beaker-comment-composer>
      ${this.renderComments(this.comments)}
    `
  }

  renderComments (comments) {
    if (!comments.length) return ''
    return html`
      <div class="comments">
        ${repeat(comments, c => c.url, c => this.renderComment(c))}
      </div>
    `
  }

  renderComment (comment) {
    return html`
      <div class="comment">
        <div class="header">
          <a class="title" href="${comment.author.url}">${comment.author.title}</a>
          <a class="permalink" href="${comment.url}" target="_blank">${timeDifference(comment.createdAt, true, 'ago')}</a>
        </div>
        <div class="body">${comment.body}</div>
        <div class="footer">
          ${'reactions' in comment
            ? html`
              <beaker-reactions
                user-url="${this.userUrl}"
                .reactions=${comment.reactions}
                topic="${comment.url}"
              ></beaker-reactions>`
            : ''}
          <span class="replies">
            ${comment.replyCount}
            ${comment.replyCount === 1 ? 'reply' : 'replies'}
          </span>
          <a href="#" @click=${e => this.onClickToggleReply(e, comment.url)}>
            ${this.activeReplies[comment.url]
              ? html`<span class="fas fa-fw fa-times"></span> Cancel reply`
              : html`<span class="fas fa-fw fa-reply"></span> Reply`}
          </a>
        </div>
        ${this.activeReplies[comment.url] ? html`
          <beaker-comment-composer
            topic="${comment.topic}"
            reply-to="${comment.url}"
            alwaysActive
            @submit-comment=${e => this.onSubmitComment(e, comment.url)}
          ></beaker-comment-composer>
        ` : ''}
        ${comment.replies && comment.replies.length ? this.renderComments(comment.replies) : ''}
      </div>
    `
  }

  // events
  // =

  async onClickToggleReply (e, url) {
    this.activeReplies[url] = !this.activeReplies[url]
    await this.requestUpdate()
    if (this.activeReplies[url]) {
      this.shadowRoot.querySelector(`beaker-comment-composer[reply-to="${url}"]`).focus()
    }
  }

  onSubmitComment (e, url) {
    this.activeReplies[url] = false
    this.requestUpdate()
  }
}
CommentsThread.styles = commentsThreadCSS

customElements.define('beaker-comments-thread', CommentsThread)