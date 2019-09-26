import { LitElement, html } from '../../../vendor/lit-element/lit-element.js'
import { repeat } from '../../../vendor/lit-element/lit-html/directives/repeat.js'
import commentsThreadCSS from '../../../css/com/comments/thread.css.js'
import { timeDifference } from '../../time.js'
import { writeToClipboard } from '../../clipboard.js'
import { emit } from '../../dom.js'
import * as contextMenu from '../context-menu.js'
import * as toast from '../toast.js'
import './composer.js'
import '../reactions/reactions.js'

export class CommentsThread extends LitElement {
  static get properties () {
    return {
      comments: {type: Array},
      topicUrl: {type: String, attribute: 'topic-url'},
      userUrl: {type: String, attribute: 'user-url'},
      activeReplies: {type: Object},
      composerPlaceholder: {type: String, attribute: 'composer-placeholder'}
    }
  }

  constructor () {
    super()
    this.comments = null
    this.topicUrl = ''
    this.userUrl = ''
    this.activeReplies = {}
    this.composerPlaceholder = undefined
  }

  render () {
    return html`
      <link rel="stylesheet" href="beaker://assets/font-awesome.css">
      <beaker-comment-composer
        topic="${this.topicUrl}"
        placeholder=${this.composerPlaceholder || 'Add your reply'}
      ></beaker-comment-composer>
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
          <a class="permalink" href="${comment.url}">${timeDifference(comment.createdAt, true, 'ago')}</a>
            <button class="menu transparent" @click=${e => this.onClickMenu(e, comment)}><span class="fas fa-fw fa-ellipsis-h"></span></button>
        </div>
        <div class="body">${comment.body}</div>
        <div class="footer">
          <a href="#" @click=${e => this.onClickToggleReply(e, comment.url)}>
            ${this.activeReplies[comment.url]
              ? html`<span class="fas fa-fw fa-times"></span> Cancel reply`
              : html`<span class="fas fa-fw fa-reply"></span> Reply`}
          </a>
          ${'reactions' in comment
            ? html`
              <beaker-reactions
                user-url="${this.userUrl}"
                .reactions=${comment.reactions}
                topic="${comment.url}"
              ></beaker-reactions>`
            : ''}
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

  onClickMenu (e, comment) {
    e.preventDefault()
    e.stopPropagation()

    var items = [
      {icon: 'far fa-fw fa-file-alt', label: 'View comment', click: () => window.open(comment.url) },
      {icon: 'fas fa-fw fa-link', label: 'Copy comment URL', click: () => {
        writeToClipboard(comment.url)
        toast.create('Copied to your clipboard')
      }}
    ]

    if (this.userUrl === comment.author.url) {
      items.push('-')
      items.push({icon: 'fas fa-fw fa-trash', label: 'Delete comment', click: () => this.onClickDelete(comment) })
    }

    var rect = e.currentTarget.getClientRects()[0]
    contextMenu.create({
      x: rect.right + 4,
      y: rect.bottom + 8,
      right: true,
      withTriangle: true,
      roomy: true,
      noBorders: true,
      fontAwesomeCSSUrl: 'beaker://assets/font-awesome.css',
      style: `padding: 4px 0`,
      items 
    })
  }

  onClickDelete (comment) {
    if (!confirm('Are you sure?')) return
    emit(this, 'delete-comment', {bubbles: true, composed: true, detail: {comment}})
  }
}
CommentsThread.styles = commentsThreadCSS

customElements.define('beaker-comments-thread', CommentsThread)