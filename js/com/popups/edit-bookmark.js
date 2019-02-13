import {LitElement, html, css} from '../../../vendor/lit-element/lit-element.js'
import popupsCSS from '../../../css/com/popups-css.js'

// exported api
// =

export class BeakerEditBookmarkPopup extends LitElement {
  constructor (bookmark) {
    super()
    this.bookmark = bookmark
  }

  // management
  //

  static async create (bookmark) {
    var popupEl = new BeakerEditBookmarkPopup(bookmark)
    document.body.appendChild(popupEl)

    const onGlobalKeyUp = e => {
      // listen for the escape key
      if (e.keyCode === 27) {
        popupEl.onCancel()
      }
    }
    document.addEventListener('keyup', onGlobalKeyUp)

    // cleanup function called on cancel
    const cleanup = () => {
      popupEl.remove()
      document.removeEventListener('keyup', onGlobalKeyUp)
    }

    // return a promise that resolves with save/cancel events
    return new Promise((resolve, reject) => {
      popupEl.addEventListener('save', e => {
        resolve(e.detail)
        cleanup()
      })

      popupEl.addEventListener('cancel', e => {
        reject()
        cleanup()
      })
    })
  }

  static destroy () {
    var popup = document.querySelector('beaker-edit-bookmark-popup')
    if (popup) popup.onCancel()    
  }

  // rendering
  // =

  render() {
    const tags = (this.bookmark.tags || '').toString().replace(',', ' ')
    return html`
    <div id="edit-bookmark-popup" class="popup-wrapper" @click=${this.onClickWrapper}>
      <form class="popup-inner" @submit=${this.onSubmit}>
        <div class="head">
          <span class="title">Edit bookmark</span>

          <span title="Cancel" @click=${this.onCancel} class="close-btn square">
            x
          </span>
        </div>

        <div class="body">
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
            <button type="button" class="btn" @click=${this.onCancel} tabindex="2">Cancel</button>
            <button type="submit" class="btn primary" tabindex="1">Save</button>
          </div>

        </div>
      </form>
    </div>
    `
  }
  
  onClickWrapper (e) {
    if (e.target.id === 'edit-bookmark-popup') {
      this.onCancel()
    }
  }

  onSubmit (e) {
    e.preventDefault()
    e.stopPropagation()
    this.dispatchEvent(new CustomEvent('save', {
      detail: {
        href: e.target.href.value,
        title: e.target.title.value,
        tags: e.target.tags.value.split(' ').filter(Boolean),
        pinned: e.target.pinned.checked,
        pinOrder: e.target.pinOrder.value
      }
    }))
  }

  onCancel (e) {
    if (e) e.preventDefault()
    this.dispatchEvent(new CustomEvent('cancel'))
  }
}

BeakerEditBookmarkPopup.styles = popupsCSS

customElements.define('beaker-edit-bookmark-popup', BeakerEditBookmarkPopup)