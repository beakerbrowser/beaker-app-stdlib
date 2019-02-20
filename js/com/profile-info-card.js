import {LitElement, html} from '../../vendor/lit-element/lit-element.js'
import profileInfoCardCSS from '../../css/com/profile-info-card.css.js'

export class ProfileInfoCard extends LitElement {
  render () {
    return html`
      <div class="cover-photo"><img src="/img/tmp-cover-photo.jpg"></div>
      <div class="avatar"><img src="/img/tmp-profile.png"></div>
      <div class="ident">
        <div><a class="title" href="#">Paul Frazee</a></div>
        <div><a class="domain" href="#">pfrazee.com</a></div>
      </div>
      <div class="description">
        Cofounder of @BeakerBrowser and @hashbaseio. Previously Secure Scuttlebutt.
      </div>
    `
  }
}
ProfileInfoCard.styles = profileInfoCardCSS

customElements.define('beaker-profile-info-card', ProfileInfoCard)