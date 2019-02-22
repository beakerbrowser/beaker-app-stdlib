import {LitElement, html} from '../../vendor/lit-element/lit-element.js'
import {toNiceDomain} from '../strings.js'
import profileInfoCardCSS from '../../css/com/profile-info-card.css.js'

export class ProfileInfoCard extends LitElement {
  static get properties () {
    return {
      user: {type: Object},
      noCoverPhoto: {type: Boolean}
    }
  }

  constructor () {
    super()
    this.user = null
    this.noCoverPhoto = false
  }

  render () {
    if (!this.user) return html`<div></div>`
    var authorDomain = (new URL(this.user.url)).hostname
    return html`
      <div class="cover-photo">
        ${this.noCoverPhoto
          ? html`<div class="fallback-cover"></div>`
          : html`<img src="${this.user.url}/cover" @error=${this.onErrorCoverPhoto}>`
        }
      </div>
      <div class="avatar">
        <a href="dat://profile/${authorDomain}"><img src="${this.user.url}/thumb"></a>
      </div>
      <div class="ident">
        <div><a class="title" href="dat://profile/${authorDomain}">${this.user.title}</a></div>
        <div><a class="domain" href="dat://profile/${authorDomain}">${toNiceDomain(this.user.url)}</a></div>
      </div>
      <div class="description">${this.user.description}</div>
    `
  }

  onErrorCoverPhoto () {
    this.noCoverPhoto = true
  }
}
ProfileInfoCard.styles = profileInfoCardCSS

customElements.define('beaker-profile-info-card', ProfileInfoCard)