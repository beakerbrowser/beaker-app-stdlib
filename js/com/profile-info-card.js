import {LitElement, html} from '../../vendor/lit-element/lit-element.js'
import {toNiceDomain} from '../strings.js'
import profileInfoCardCSS from '../../css/com/profile-info-card.css.js'

export class ProfileInfoCard extends LitElement {
  static get properties () {
    return {
      user: {type: Object},
      noCoverPhoto: {type: Boolean},
      noAvatar: {type: Boolean},
      viewProfileBaseUrl: {type: String, attribute: 'view-profile-base-url'}
    }
  }

  constructor () {
    super()
    this.user = null
    this.noCoverPhoto = false
    this.noAvatar = false
    this.viewProfileBaseUrl = 'intent:unwalled.garden/view-profile?url='
  }

  render () {
    if (!this.user) return html`<div></div>`
    var viewProfileUrl = `${this.viewProfileBaseUrl}${encodeURIComponent(this.user.url)}`
    return html`
      <div class="cover-photo">
        ${this.noCoverPhoto
          ? html`<div class="fallback-cover"></div>`
          : html`<img src="${this.user.url}/cover" @error=${this.onErrorCoverPhoto}>`
        }
      </div>
      <div class="avatar">
        <a href="${viewProfileUrl}">
          ${this.noAvatar
            ? html`<div class="fallback-avatar"></div>`
            : html`<img src="${this.user.url}/thumb" @error=${this.onErrorAvatar}>`
          }
        </a>
      </div>
      <div class="ident">
        <div><a class="title" href="${viewProfileUrl}">${this.user.title}</a></div>
        <div><a class="domain" href="${this.user.url}">${toNiceDomain(this.user.url)}</a></div>
      </div>
      <div class="description">${this.user.description}</div>
    `
  }

  onErrorCoverPhoto () {
    this.noCoverPhoto = true
  }

  onErrorAvatar () {
    this.noAvatar = true
  }
}
ProfileInfoCard.styles = profileInfoCardCSS

customElements.define('beaker-profile-info-card', ProfileInfoCard)