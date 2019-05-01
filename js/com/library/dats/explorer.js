import { html } from '../../../../vendor/lit-element/lit-element.js'
import { Explorer } from '../explorer.js'
import * as toast from '../../toast.js'
import { emit } from '../../../dom.js'
import './list.js'
import '../sidebars/dat.js'

const profilesAPI = navigator.importSystemAPI('profiles')
const libraryAPI = navigator.importSystemAPI('library')
const graphAPI = navigator.importSystemAPI('unwalled-garden-graph')

export const CATEGORIES = {
  all:          {type: false,                         icon: 'fas fa-sitemap',          label: 'All'},
  applications: {type: 'unwalled.garden/application', icon: 'far fa-window-restore',   label: 'Applications'},
  modules:      {type: 'unwalled.garden/module',      icon: 'fas fa-cubes',            label: 'Modules'},
  // musicAlbums:  {type: 'unwalled.garden/music-album', icon: 'fas fa-music',            label: 'Music albums'},
  // photoAlbums:  {type: 'unwalled.garden/photo-album', icon: 'far fa-image',            label: 'Photo albums'},
  // podcasts:     {type: 'unwalled.garden/podcast',     icon: 'fas fa-microphone',       label: 'Podcasts'},
  templates:    {type: 'unwalled.garden/template',    icon: 'fas fa-drafting-compass', label: 'Templates'},
  users:        {type: 'unwalled.garden/user',        icon: 'fas fa-users',            label: 'Users'},
  trash:        {type: false,                         icon: 'fas fa-trash',            label: 'Trash'},
  websites:     {type: false,                         icon: 'fas fa-sitemap',          label: 'Websites'},
  // wikis:        {type: 'unwalled.garden/wiki',        icon: 'far fa-file-word',        label: 'Wikis'}
}

export const KNOWN_TYPES = Object.values(CATEGORIES).map(c => c.type).filter(Boolean)

export function getCategoryLabel (id) {
  return CATEGORIES[id].label
}

export function getCategoryIcon (id) {
  return CATEGORIES[id].icon
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
      searchFilter: {type: String},
      selectedKeys: {type: Array}
    }
  }

  constructor () {
    super()
    this.category = ''
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
    if (this.category === 'users') {
      // TODO replace this with a library api list query
      this.dats = [self].concat(await graphAPI.listFollows(self.url))
    } else if (this.category === 'applications') {
      this.dats = await libraryAPI.list({filters: {type: CATEGORIES.applications.type, saved: true}})
    } else if (this.category === 'modules') {
      this.dats = await libraryAPI.list({filters: {type: CATEGORIES.modules.type, saved: true}})
    } else if (this.category === 'templates') {
      this.dats = await libraryAPI.list({filters: {type: CATEGORIES.templates.type, saved: true}})
    } else if (this.category === 'websites') {
      this.dats = await libraryAPI.list({filters: {saved: true}})
      this.dats = this.dats.filter(d => !hasKnownType(d))
    } else if (this.category === 'wikis') {
      this.dats = await libraryAPI.list({filters: {type: CATEGORIES.wikis.type, saved: true}})
    } else if (this.category === 'trash') {
      this.dats = await libraryAPI.list({filters: {owner: true, saved: false}})
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

  async moveToTrash (rows) {
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

    toast.create('Moved to trash', '', 10e3, { label: 'Undo', click: undo })
  }

  async restoreFromTrash (rows) {
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

    toast.create('Restored from trash', '', 10e3, { label: 'Undo', click: undo })
  }

  async deletePermanently (rows) {
    if (!confirm('Delete permanently? This cannot be undone.')) {
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

  renderList () {
    var dats = this.dats
    if (this.searchFilter) {
      dats = dats.filter(dat => {
        if (dat.title && dat.title.toLowerCase().includes(this.searchFilter)) {
          return true
        } else if (dat.description && dat.description.toLowerCase().includes(this.searchFilter)) {
          return true
        } else if (dat.url && dat.url.toLowerCase().includes(this.searchFilter)) {
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
        @move-to-trash=${this.onMoveToTrash}
        @restore-from-trash=${this.onRestoreFromTrash}
        @delete-permanently=${this.onDeletePermanently}
      ></beaker-library-dats-list>
    `
  }

  renderToolbarButtons () {
    var hasSingleSelection = this.selectedKeys.length === 1
    var canDelete = this.selectedKeys.length > 0
    var dats = this.selectedKeys.map(key => this.getDatByKey(key))
    dats.forEach(dat => {
      if (!dat) return
      if (!dat.owner || dat.url === this.currentUser.url) {
        canDelete = false
      }
    })

    // TODO
    // <div class="btn-group">
    //   <button class="pressed" title="List view"><i class="fas fa-fw fa-list"></i></button>
    //   <button title="Grid view"><i class="fas fa-fw fa-th"></i></button>
    // </div>

    return html`
      ${this.category === 'trash'
        ? html`
          <div class="btn-group">
            ${this.renderToolbarButton('Restore from trash', 'fas fa-undo', e => this.restoreFromTrash(dats), !canDelete)}
            ${this.renderToolbarButton('Delete permanently', 'fas fa-times-circle', e => e => this.deletePermanently(dats), !canDelete)}
          </div>
        ` : html`
          <div class="btn-group">
            ${this.renderToolbarButton('Open', 'fas fa-external-link-alt', e => window.open(dats[0].url), !hasSingleSelection)}
          </div>
          <div class="btn-group">
            ${this.renderToolbarButton('Explore', 'far fa-folder-open', e => emit(this, 'change-location', {detail: {view: 'files', dat: dats[0].url}}), !hasSingleSelection)}
            ${this.renderToolbarButton('Edit source', 'far fa-edit', e => window.open(`beaker://editor/${dats[0].url}`), !hasSingleSelection)}
          </div>
          <div class="btn-group">
            ${this.renderToolbarButton('Move to trash', 'far fa-trash-alt', e => this.moveToTrash(dats), !canDelete)}
          </div>
        `}
    `
  }
  
  renderSidebarNoSelection () {
    return html`<div></div>`
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
    if (name === 'category') {
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

  onMoveToTrash (e) {
    this.moveToTrash(e.detail.rows)
  }

  onRestoreFromTrash (e) {
    this.restoreFromTrash(e.detail.rows)
  }

  onDeletePermanently (e) {
    this.deletePermanently(e.detail.rows)
  }
}

customElements.define('beaker-library-dats-explorer', DatsExplorer)