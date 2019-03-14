import { html } from '../../../vendor/lit-element/lit-element.js'
import { BasePopup } from './base.js'

// exported api
// =

export class BeakerEditBookmarkPopup extends BasePopup {
  constructor (bookmark) {
    super()
    this.bookmark = bookmark
    this.isCreate = !bookmark.href
  }

  // management
  //

  static async create (bookmark) {
    return BasePopup.create(BeakerEditBookmarkPopup, bookmark)
  }

  static destroy () {
    return BasePopup.destroy('beaker-edit-bookmark-popup')
  }

  // rendering
  // =

  renderTitle () {
    return `${this.isCreate ? 'Create' : 'Edit'} bookmark`
  }

  renderBody () {
    const tags = (this.bookmark.tags || '').toString().replace(',', ' ')
    return html`
      <form @submit=${this.onSubmit}>
        <div>
          <label for="href-input">URL</label>
          <input required type="text" id="href-input" name="href" value="${this.bookmark.href}" />

          <label for="title-input">Title</label>
          <input required type="text" id="title-input" name="title" value="${this.bookmark.title}" />

          <label for="tags">Tags</label>
          <input type="text" name="tags" value="${tags}" />
        </div>

        <label class="toggle">
          <span class="text">Pin to start page</span>
          <input type="hidden" name="pinOrder" value="${this.bookmark.pinOrder}" />
          <input checked="${this.bookmark.pinned}" type="checkbox" name="pinned" value="pinned">
          <div class="switch"></div>
        </label>

        <div class="actions">
          <button type="button" class="btn" @click=${this.onReject} tabindex="2">Cancel</button>
          <button type="submit" class="btn primary" tabindex="1">Save</button>
        </div>
      </form>
    `
  }
  
  // events
  // =

  onSubmit (e) {
    e.preventDefault()
    e.stopPropagation()
    this.dispatchEvent(new CustomEvent('resolve', {
      detail: {
        href: e.target.href.value,
        title: e.target.title.value,
        tags: e.target.tags.value.split(' ').filter(Boolean),
        pinned: e.target.pinned.checked,
        pinOrder: e.target.pinOrder.value
      }
    }))
  }
}

customElements.define('beaker-edit-bookmark-popup', BeakerEditBookmarkPopup)