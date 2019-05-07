import { LitElement, html, css } from '../../../vendor/lit-element/lit-element.js'
import { repeat } from '../../../vendor/lit-element/lit-html/directives/repeat.js'
import { classMap } from '../../../vendor/lit-element/lit-html/directives/class-map.js'
import * as DatExplorer from './dats/explorer.js'
import tooltipCSS from '../../../css/tooltip.css.js'

class AppNav extends LitElement {
  static get properties () {
    return {
      collapsed: {type: Boolean},
      followLinks: {type: Boolean, attribute: 'follow-links'},
      user: {type: Object},
      view: {type: String},
      category: {type: String},
      dat: {type: String}
    }
  }

  constructor () {
    super()
    this.collapsed = false
    this.followLinks = false
  }

  makeDatCategory (id) {
    return {
      view: 'dats',
      category: id,
      label: DatExplorer.getCategoryLabel(id),
      icon: DatExplorer.getCategoryIcon(id)
    }
  }

  get tabs () {
    return [
      {view: 'bookmarks', category: undefined, icon: 'far fa-star', label: 'Bookmarks'},
      this.makeDatCategory('people'),
      html`<h5>Media</h5>`,
      this.makeDatCategory('websites'),
      this.makeDatCategory('images'),
      this.makeDatCategory('music'),
      this.makeDatCategory('videos'),
      this.makeDatCategory('podcasts'),
      this.makeDatCategory('wikis'),
      html`<h5>Software</h5>`,
      this.makeDatCategory('applications'),
      this.makeDatCategory('interfaces'),
      this.makeDatCategory('modules'),
      html`<h5>System</h5>`,
      {view: 'database', category: undefined, icon: 'fas fa-database', label: 'Database'},
      {view: 'help', category: undefined, icon: 'far fa-question-circle', label: 'Help'}
    ]
  }

  isTabActive (tab) {
    for (let k of ['view', 'category', 'dat']) {
      if (tab[k] === undefined || (!this[k] && !tab[k]) || (this[k] === tab[k])) {
        continue
      }
      return false
    }
    return true
  }

  render () {
    return html`
      <link rel="stylesheet" href="/vendor/beaker-app-stdlib/css/fontawesome.css">
      <div class="${classMap({collapsed: this.collapsed})}">
        ${repeat(this.tabs, tab => this.renderTab(tab))}
      </div>
    `
  }

  renderTab (tab) {
    if (tab.spacer) return html`<span style="flex: 1"></span>`
    if (tab.type === 'html') return tab

    var {label, icon, onClick} = tab
    const cls = classMap({active: this.isTabActive(tab), 'tooltip-nodelay': true, 'tooltip-right': true})
    if (this.collapsed) {
      return html`<a data-tooltip="${label}" class="${cls}" @click=${onClick ? onClick : e => this.onClickTab(e, tab)}><i class="fa-fw ${icon}"></i></a>`
    }
    return html`<a class="${cls}" @click=${onClick ? onClick : e => this.onClickTab(e, tab)}><i class="fa-fw ${icon}"></i> ${label}</a>`
  }

  onClickTab (e, tab) {
    if (this.followLinks) {
      window.location = `beaker://library/?view=${tab.view}&category=${tab.category || ''}`
    } else {
      this.dispatchEvent(new CustomEvent('change-location', {detail: tab}))
    }
  }
}
AppNav.styles = [tooltipCSS, css`
:host {
  display: block;
  padding: 15px 0 5px;
  user-select: none;
}

h5 {
  margin: 15px 10px 5px;
  color: #666673;
  font-weight: 400;
}

a {
  display: flex;
  padding: 6px 16px;
  align-items: center;
  border: 0;
}

a:hover {
  background: rgba(0,0,0,.03);
}

a i {
  margin-right: 8px;
  font-size: 16px;
  color: gray;
}

a.active {
  color: #111;
  background: rgba(0,0,0,.05);
}

hr {
  border: 0;
  border-top: 1px solid #ccc;
}

.collapsed h5 {
  visibility: hidden;
}

.collapsed i {
  margin-right: 0;
}
`]
customElements.define('beaker-library-app-nav', AppNav)
