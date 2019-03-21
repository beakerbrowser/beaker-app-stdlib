import { html, css } from '../../../vendor/lit-element/lit-element.js'
import { BasePopup } from './base.js'
import '../history-autocomplete.js'
import popupsCSS from '../../../css/com/popups.css.js'

// exported api
// =

export class BeakerEditBookmarkPopup extends BasePopup {
  constructor (bookmark, {fontawesomeSrc} = {}) {
    super()
    this.fontawesomeSrc = fontawesomeSrc
    this.bookmark = bookmark
    this.isCreate = !bookmark.href
  }

  // management
  //

  static async create (bookmark, {fontawesomeSrc} = {}) {
    return BasePopup.create(BeakerEditBookmarkPopup, bookmark, {fontawesomeSrc})
  }

  static destroy () {
    return BasePopup.destroy('beaker-edit-bookmark-popup')
  }

  // rendering
  // =

  renderTitle () {
    return `${this.isCreate ? 'Add a' : 'Edit'} bookmark`
  }

  renderBody () {
    const tags = (this.bookmark.tags || '').toString().replace(',', ' ')
    return html`
      <link rel="stylesheet" href="${this.fontawesomeSrc}">
      <form @submit=${this.onSubmit}>
        <div>
          <label for="href-input">URL</label>
          <beaker-history-autocomplete
            query="${this.bookmark.href}"
            placeholder="E.g. beakerbrowser.com"
            @selection-changed=${this.onUrlSelectionChanged}
          ></beaker-history-autocomplete>

          <label for="title-input">Title</label>
          <input required type="text" id="title-input" name="title" value="${this.bookmark.title}" placeholder="E.g. Beaker Browser" />

          <label for="description-input">Description</label>
          <textarea type="text" id="description-input" name="description" placeholder="Optional">${this.bookmark.description}</textarea>

          <label for="tags">Tags</label>
          <input type="text" name="tags" value="${tags}" placeholder="Separate with spaces" />
        </div>

        <div class="other-options">
          <div class="input-group">
            <label>Visibility</label>
            <div class="privacy">
              <input type="radio" id="privacy-private" name="privacy" value="private" ?checked=${!this.bookmark['public']}>
              <label class="btn" for="privacy-private">
                <i class="fa fa-lock"></i>
                Private
              </label>
              <input type="radio" id="privacy-public" name="privacy" value="public" ?checked=${this.bookmark['public']}>
              <label class="btn" for="privacy-public">
                <i class="fa fa-globe"></i>
                Public
              </label>
            </div>
          </div>
          <div>
            <label class="toggle">
              <span class="text">Pin to start page</span>
              <input type="hidden" name="pinOrder" value="${this.bookmark.pinOrder || ''}" />
              <input ?checked=${this.bookmark.pinned} type="checkbox" name="pinned" value="pinned">
              <div class="switch"></div>
            </label>
          </div>
        </div>

        <div class="actions">
          <button type="button" class="btn" @click=${this.onReject} tabindex="2">Cancel</button>
          <button type="submit" class="btn primary" tabindex="1">Save</button>
        </div>
      </form>
    `
  }
  
  // events
  // =

  onUrlSelectionChanged (e) {
    var input = this.shadowRoot.querySelector('input[name=title]')
    input.value = e.detail.title
    input.focus()
    input.select()
  }

  onSubmit (e) {
    e.preventDefault()
    e.stopPropagation()
    this.dispatchEvent(new CustomEvent('resolve', {
      detail: {
        href: this.shadowRoot.querySelector('beaker-history-autocomplete').value,
        title: e.target.title.value,
        description: e.target.description.value,
        tags: e.target.tags.value.split(' ').filter(Boolean),
        pinned: e.target.pinned.checked,
        public: e.target.privacy.value === 'public',
        pinOrder: e.target.pinOrder.value
      }
    }))
  }
}
BeakerEditBookmarkPopup.styles = [popupsCSS, css`
.popup-inner {
  width: 500px;
}

.popup-inner label {
  font-size: 11px;
}

beaker-history-autocomplete {
  margin-bottom: 5px;
  display: block;
}

.other-options {
  display: flex;
  background: #fafafa;
  padding: 16px;
}

.other-options > div {
  margin-right: 30px;
}

.other-options label.toggle {
  justify-content: flex-start;
  flex-direction: column;
  align-items: baseline;
}

.other-options label.toggle .text {
  margin-bottom: 6px;
  font-weight: 500;
}

.privacy {
  display: flex;
  width: 150px;
}

.privacy input {
  opacity: 0;
  width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

.privacy label.btn {
  display: inline-block;
  width: 100%;
  border-radius: 4px 0 0 4px;
  margin-right: 0;
  text-align: center;
  height: 24px;
  line-height: 24px;
  font-size: 11px;
  background: #fff;
}

.privacy input:checked + label {
  background: #41bb56;
  border-color: #41bb56;
  -webkit-font-smoothing: antialiased;
  box-shadow: inset 0 1px 3px rgba(0,0,0,.2);
  color: #fff;
  font-weight: 500;
}

.privacy label.btn i {
  margin-right: 2px;
  font-size: 9px;
  line-height: inherit;
  vertical-align: top;
}

.privacy label.btn:not(:last-child) {
  border-right: 0;
}

.privacy label.btn:last-child {
  border-left: 0;
  border-radius: 0 4px 4px 0;
}
`]

customElements.define('beaker-edit-bookmark-popup', BeakerEditBookmarkPopup)