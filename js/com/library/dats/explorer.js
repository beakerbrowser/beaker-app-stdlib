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
    itemLabel: 'Application'
  },
  music: {
    type: 'unwalled.garden/music',
    icon: 'fas fa-music',
    label: 'Music',
    itemLabel: 'Music Album'
  },
  modules: {
    type: 'unwalled.garden/module',
    icon: 'fas fa-cubes',
    label: 'Modules',
    itemLabel: 'Module'
  },
  people: {
    type: 'unwalled.garden/person',
    icon: 'fas fa-users',
    label: 'People',
    itemLabel: 'Person'
  },
  images: {
    type: 'unwalled.garden/photo-album',
    icon: 'fas fa-image',
    label: 'Images',
    itemLabel: 'Photo Album'
  },
  podcasts: {
    type: 'unwalled.garden/podcast',
    icon: 'fas fa-microphone',
    label: 'Podcasts',
    itemLabel: 'Podcast'
  },
  interfaces: {
    type: 'unwalled.garden/interface',
    icon: 'fas fa-mouse-pointer',
    label: 'Interfaces',
    itemLabel: 'Interface'
  },
  videos: {
    type: 'unwalled.garden/video',
    icon: 'fas fa-film',
    label: 'Videos',
    itemLabel: 'Video'
  },
  websites: {
    type: false,
    icon: 'fas fa-sitemap',
    label: 'Websites',
    itemLabel: 'Website'
  }
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

export function getCategoryItemLabel (id) {
  return CATEGORIES[id].itemLabel
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

export function isPerson (dat) {
  if (!dat.type) return false
  return Boolean(dat.type.find(t => t === 'unwalled.garden/person'))
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

  get viewPath () {
    return [
      {title: getCategoryLabel(this.category), icon: getCategoryIcon(this.category), onClick: e => emit(this, 'change-location', {detail: {view: 'dats', category: category.id}})}
    ]
  }

  buildContextMenuItems () {
    return [
      {icon: 'fas fa-fw fa-plus', label: `New ${getCategoryItemLabel(this.category)}`, click: () => this.onClickNew()}
    ]
  }
  
  // data management
  // =

  async load () {
    this.reset()
    this.safelyAccessListEl(el => el.clearSelection())

    var self = await profilesAPI.getCurrentUser()
    this.currentUser = self
    var saved = !this.ownerFilter ? true : undefined
    var owner = this.ownerFilter === 'mine' ? true : undefined
    if (this.category === 'following') {
      // TODO replace this with a library api list query
      this.dats = [self].concat(await graphAPI.listFollows(self.url))
    } else if (this.category === 'websites') {
      this.dats = await libraryAPI.list({filters: {owner, saved}})
      this.dats = this.dats.filter(d => !hasKnownType(d))
    } else {
      this.dats = await libraryAPI.list({filters: {owner, saved, type: CATEGORIES[this.category].type}})
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

  // renderHeader () {
  //   return html`
  //     <h2>
  //       <i class="${getCategoryIcon(this.category)}"></i>
  //       ${getCategoryLabel(this.category)}
  //     </h2>
  //   `
  // }

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
        section="${this.ownerFilter}"
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
    const canMakeNew = this.category !== 'people'

    return html`
      <div class="path" style="margin-right: 20px;">${this.renderPath()}</div>
      <div class="radio-group">
        ${filterOpt(false, 'Library')}
        ${filterOpt('mine', 'Created by me')}
      </div>
      <div class="spacer"></div>
      ${canMakeNew
        ? html`
          <div class="btn-group">
            <button @click=${this.onClickNew} class="primary"><i class="fa-fw fas fa-plus"></i> New ${getCategoryItemLabel(this.category)}</button>
          </div>
        ` : ''}
    `
  }
  
  renderSidebarOneSelection () {
    return html`
      <beaker-library-dat-sidebar
        url="${this.selectedKeys[0]}"
        @add-to-library=${this.onAddToLibrary}
        @remove-from-library=${this.onRemoveFromLibrary}
        @delete-permanently=${this.onDeletePermanently}
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