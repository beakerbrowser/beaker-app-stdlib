import { LitElement, html, css } from '../../../../vendor/lit-element/lit-element.js'
import sidebarStyles from '../../../../css/com/library/sidebar.css.js'
import { toNiceUrl } from '../../../strings.js'
import { buildContextMenuItems } from './list.js'
import * as contextMenu from '../../context-menu.js'
import { emit } from '../../../dom.js'

export class BookmarkSidebar extends LitElement {
  static get properties () {
    return {
      bookmark: {type: Object}
    }
  }

  constructor () {
    super()
    this.bookmark = null
  }

  // rendering
  // =

  render () {
    if (!this.bookmark) return html``
    const bookmark = this.bookmark
    console.log(bookmark)
    return html`
      <link rel="stylesheet" href="/vendor/beaker-app-stdlib/css/fontawesome.css">
      <div class="panel">
        <div class="panel-banner">
          <img class="cover" src="asset:cover:${bookmark.href}">
          <img class="thumb" src="asset:thumb:${bookmark.href}">
          <div class="ctrls">
            <span class="btn-group rounded">
              <button @click=${this.onClickOpen}><i class="fas fa-external-link-alt"></i> Open</button>
              ${bookmark.isOwner
                ? html`<button @click=${this.onClickEdit}><i class="fas fa-pencil-alt"></i> Edit</button>`
                : ''}
              <button @click=${this.onClickMenu}><i class="fas fa-ellipsis-h"></i></button>
            </span>
          </div>
        </div>
        <div class="panel-body">
          <h2 class="name">${bookmark.title}</h2>
          <p><a href="${bookmark.href}" target="_blank" title="${bookmark.title}">${toNiceUrl(bookmark.href)}</a></p>
          ${bookmark.description || bookmark.tags.length
            ? html`
              <p>
                ${bookmark.description}
                ${bookmark.tags.length ? html`<br><small style="color: gray">${bookmark.tags.join(' ')}</small>` : ''}
              </p>`
            : ''}
          ${bookmark.author
            ? html`
              <div class="author">
                <small>Bookmarked by:</small>
                <a href="intent:unwalled.garden/view-profile?url=${encodeURIComponent(bookmark.author.url)}" target="_blank">
                  <img class="avatar" src="asset:thumb:${bookmark.author.url}">
                  ${bookmark.author.title || ''}
                </a>
              </div>`
            : ''}
        </div>
      </div>
    `
  }

  // events
  // =

  onClickOpen (e) {
    window.open(this.bookmark.href)
  }

  onClickEdit (e) {
    emit(this, 'edit-bookmark', {detail: {bookmark: this.bookmark}})
  }

  onClickMenu (e) {
    var items = buildContextMenuItems(this, this.bookmark, {noOpen: true, noExplore: this.noExplore})
    if (!items) return

    e.preventDefault()
    e.stopPropagation()
    const style = `padding: 4px 0`  
    contextMenu.create({x: e.clientX, y: e.clientY, items, style, right: true, noBorders: true, fontAwesomeCSSUrl: '/vendor/beaker-app-stdlib/css/fontawesome.css'})
  }
}
BookmarkSidebar.styles = [sidebarStyles, css`
p {
  word-break: break-word;
}

.author a {
  display: flex;
  align-items: center;
  color: inherit;
  text-decoration: none;
  padding: 5px 10px;
  margin: 5px 0;
}

.author a:hover {
  background: #f5f5f7;
}

.author .avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 5px;
}
`]

customElements.define('beaker-library-bookmark-sidebar', BookmarkSidebar)
