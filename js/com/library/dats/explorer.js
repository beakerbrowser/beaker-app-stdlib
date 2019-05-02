import { html } from '../../../../vendor/lit-element/lit-element.js'
import { classMap } from '../../../../vendor/lit-element/lit-html/directives/class-map.js'
import { Explorer } from '../explorer.js'
import * as toast from '../../toast.js'
import { emit } from '../../../dom.js'
import './list.js'
import '../sidebars/dat.js'

const profilesAPI = navigator.importSystemAPI('profiles')
const libraryAPI = navigator.importSystemAPI('library')
const graphAPI = navigator.importSystemAPI('unwalled-garden-graph')

export const CATEGORIES = {
  all: {
    type: false,
    icon: 'fas fa-sitemap',
    label: 'All'
  },
  applications: {
    type: 'unwalled.garden/application',
    icon: 'far fa-window-restore',
    label: 'Applications',
    description: 'Applications can be installed to provide new experiences.'
  },
  modules: {
    type: 'unwalled.garden/module',
    icon: 'fas fa-cubes',
    label: 'Modules',
    description: 'Modules contain code which can be imported into applications.'
  },
  templates: {
    type: 'unwalled.garden/template',
    icon: 'fas fa-drafting-compass',
    label: 'Templates',
    description: 'Templates are kits for creating new websites.'
  },
  users: {
    type: 'unwalled.garden/user',
    icon: 'fas fa-users',
    label: 'Users',
    description: 'Users are the people who make the Web. That includes you!'
  },
  websites: {
    type: false,
    icon: 'fas fa-sitemap',
    label: 'Websites',
    description: 'Websites contain pages of information and media for you to browse.'
  },
}

export const KNOWN_TYPES = Object.values(CATEGORIES).map(c => c.type).filter(Boolean)

export function getCategoryLabel (id) {
  return CATEGORIES[id].label
}

export function getCategoryIcon (id) {
  return CATEGORIES[id].icon
}

export function getCategoryDescription (id) {
  return CATEGORIES[id].description
}

export function findCategoryForDat (dat) {
  var type = dat && dat.type ? dat.type : []
  var id = 'websites'
  for (let k in CATEGORIES) {
    if (type.includes(CATEGORIES[k].type)) {
      id = k
      break
    }
  }
  return Object.assign({id}, CATEGORIES[id])
}

export function hasKnownType (dat) {
  if (!dat.type) return false
  return !!dat.type.find(t => KNOWN_TYPES.includes(t))
}

export class DatsExplorer extends Explorer {
  static get properties () {
    return {
      category: {type: String},
      ownerFilter: {type: String, attribute: 'owner-filter'},
      searchFilter: {type: String},
      selectedKeys: {type: Array}
    }
  }

  constructor () {
    super()
    this.category = ''
    this.ownerFilter = ''
    this.currentUser = null
    this.dats = []
  }

  getDatByKey (key) {
    return this.dats.find(d => d.key === key)
  }
  
  // data management
  // =

  async load () {
    this.reset()
    this.safelyAccessListEl(el => el.clearSelection())

    var self = await profilesAPI.getCurrentUser()
    this.currentUser = self
    var owner = this.ownerFilter === 'yours' ? true : undefined
    if (this.category === 'users') {
      // TODO replace this with a library api list query
      this.dats = [self].concat(await graphAPI.listFollows(self.url))
    } else if (this.category === 'applications') {
      this.dats = await libraryAPI.list({filters: {owner, type: CATEGORIES.applications.type}})
    } else if (this.category === 'modules') {
      this.dats = await libraryAPI.list({filters: {owner, type: CATEGORIES.modules.type}})
    } else if (this.category === 'templates') {
      this.dats = await libraryAPI.list({filters: {owner, type: CATEGORIES.templates.type}})
    } else if (this.category === 'websites') {
      this.dats = await libraryAPI.list({filters: {owner}})
      this.dats = this.dats.filter(d => !hasKnownType(d))
    } else {
      this.dats = await libraryAPI.list({filters: {saved: true}})
    }
    console.log(this.dats)
    this.dats.forEach(row => { row.key = row.url })
    this.sort()
    this.requestUpdate()
  }

  sort (column = '', directionStr = '') {
    // current sort settings are maintained in the list, pull from there
    if (!column) column = this.safelyAccessListEl(el => el.sortColumn, 'title')
    if (!directionStr) directionStr = this.safelyAccessListEl(el => el.sortDirection, 'asc')

    var direction = directionStr === 'asc' ? 1 : -1
    this.dats.sort((a, b) => {
      var v
      if (Array.isArray(a[column])) {
        v = a[column].join('').localeCompare(b[column].join(''))
      } else if (typeof a[column] === 'string') {
        v = a[column].localeCompare(b[column])
      } else {
        v = b[column] - a[column]
      }
      return v * direction
    })
    this.requestUpdate()
  }

  async addToLibrary (rows) {
    // add items
    for (let row of rows) {
      await libraryAPI.add(row.url).catch(err => false)
    }
    // reload state
    this.safelyAccessListEl(el => el.clearSelection())
    await this.load()

    const undo = async () => {
      // reremove items
      for (let row of rows) {
        await libraryAPI.remove(row.url).catch(err => false)
      }
      // reload state
      await this.load()
    }

    toast.create('Added to your library', '', 10e3, { label: 'Undo', click: undo })
  }

  async removeFromLibrary (rows) {
    // remove items
    for (let row of rows) {
      await libraryAPI.remove(row.url).catch(err => false)
    }
    // reload state
    this.safelyAccessListEl(el => el.clearSelection())
    await this.load()

    const undo = async () => {
      // readd items
      for (let row of rows) {
        await libraryAPI.add(row.url).catch(err => false)
      }
      // reload state
      await this.load()
    }

    toast.create('Removed from your library', '', 10e3, { label: 'Undo', click: undo })
  }

  async deletePermanently (rows) {
    if (!confirm('Delete? This cannot be undone.')) {
      return
    }
    // permadelete
    for (let row of rows) {
      await beaker.archives.delete(row.url) // HACK this should be the library API
    }
    // reload state
    this.safelyAccessListEl(el => el.clearSelection())
    await this.load()
  }

  // rendering
  // =

  renderHeader () {
    return html`
      <h2>
        <i class="${getCategoryIcon(this.category)}"></i>
        ${getCategoryLabel(this.category)}
      </h2>
    `
  }

  renderList () {
    var dats = this.dats
    if (this.searchFilter) {
      dats = dats.filter(dat => {
        if (dat.title && dat.title.toLowerCase().includes(this.searchFilter)) {
          return true
        } else if (dat.description && dat.description.toLowerCase().includes(this.searchFilter)) {
          return true
        }
        return false
      })
    }
    return html`
      <beaker-library-dats-list
        .rows=${dats}
        category="${this.category}"
        current-user-url="${this.currentUser ? this.currentUser.url : ''}"
        current-user-title="${this.currentUser ? this.currentUser.title : ''}"
        @sort=${this.onSort}
        @add-to-library=${this.onAddToLibrary}
        @remove-from-library=${this.onRemoveFromLibrary}
        @delete-permanently=${this.onDeletePermanently}
      ></beaker-library-dats-list>
    `
  }

  renderToolbar () {
    const filterOpt = (v, label) => {
      const cls = classMap({pressed: v == this.ownerFilter, radio: true})
      return html`<button class="${cls}" @click=${e => { emit(this, 'change-location', {detail: {view: 'dats', category: this.category, ownerFilter: v}}) }}>${label}</button>`
    }
    const canMakeNew = this.category !== 'users'

    return html`
      <div class="radio-group">
        ${filterOpt(false, 'All')}
        ${filterOpt('yours', 'Yours')}
        ${filterOpt('recent', 'Recent')}
      </div>
      ${canMakeNew
        ? html`
          <div class="btn-group">
            <button @click=${this.onClickNew}><i class="fa-fw fas fa-plus"></i> New ${this.category.slice(0, -1)}</button>
          </div>
        ` : ''}
      <div class="spacer"></div>
      ${this.renderToolbarSearch()}
    `
  }
  
  renderSidebarOneSelection () {
    return html`
      <beaker-library-dat-sidebar
        url="${this.selectedKeys[0]}"
      ></beaker-library-dat-sidebar>
    `
  }

  renderSidebarMultiSelection () {
    return html`${this.selectedKeys.length} sites selected`
  }

  // events
  // =

  attributeChangedCallback (name, oldval, newval) {
    super.attributeChangedCallback(name, oldval, newval)
    if (name === 'category' || name === 'owner-filter') {
      this.load()
    }
  }

  safelyAccessListEl (fn, fallback = undefined) {
    try {
      return fn(this.shadowRoot.querySelector('beaker-library-dats-list'))
    } catch (e) {
      // ignore
      console.debug(e)
      return fallback
    }
  }

  onSort (e) {
    this.sort(e.detail.column, e.detail.direction)
  }

  onAddToLibrary (e) {
    this.addToLibrary(e.detail.rows)
  }

  onRemoveFromLibrary (e) {
    this.removeFromLibrary(e.detail.rows)
  }

  onDeletePermanently (e) {
    this.deletePermanently(e.detail.rows)
  }

  onClickNew (e) {
    emit(this, 'change-location', {detail: {view: 'new-website'}})
  }
}

customElements.define('beaker-library-dats-explorer', DatsExplorer)