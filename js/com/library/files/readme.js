import { LitElement, html, css } from '../../../../vendor/lit-element/lit-element.js'
import { unsafeHTML } from '../../../../vendor/lit-element/lit-html/directives/unsafe-html.js'
import { joinPath } from '../../../strings.js'

export class FilesReadme extends LitElement {
  static get properties () {
    return {
      datInfo: {type: Object},
      path: {type: String},
      files: {type: Array},
      readme: {type: String}
    }
  }

  constructor () {
    super()
    this.datInfo = null
    this.path = ''
    this._files = []
    this.readmeInfo = null
    this.readme = ''
  }

  get files () {
    return this._files
  }

  set files (v) {
    this._files = v
    this.load()
  }

  getReadmeFileInfo () {
    return this.files.find(f => ['readme', 'readme.md'].includes(f.name.toLowerCase()))
  }

  createMarkdownRenderer () {
    if (typeof markdownit === 'undefined') return

    // instantiate markdownit (imported via a script tag)
    var md = markdownit({
      html: false, // Enable HTML tags in source
      xhtmlOut: false, // Use '/' to close single tags (<br />)
      breaks: true, // Convert '\n' in paragraphs into <br>
      langPrefix: 'language-', // CSS language prefix for fenced blocks
      linkify: true, // Autoconvert URL-like text to links
  
      // Enable some language-neutral replacement + quotes beautification
      typographer: true,
  
      // Double + single quotes replacement pairs, when typographer enabled,
      // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
      quotes: '“”‘’',
  
      // Highlighter function. Should return escaped HTML,
      // or '' if the source string is not changed
      highlight: function (/* str, lang */) { return '' }
    })
  
    // function to convert hrefs into usable forms
    // - any relative links are changed to absolute links on the dat we're viewing
    // - if disallowRemote=true, requires the links to be to the dat we're viewing
    const hrefMassager = (href, disallowRemote = false) => {
      var isRelative = href.startsWith('/') || href.startsWith('./')
      if (!isRelative && href.indexOf(':') === -1) {
        isRelative = true
      }
      if (isRelative) {
        if (href.startsWith('/')) href = `/${href.slice(1)}`
        else if (href.startsWith('./')) href = joinPath(this.path, href.slice(2))
        else href = joinPath(this.path, href)
        return `${this.datInfo.url}${href}`
      }
      if (disallowRemote) {
        if (!href.startsWith(this.datInfo.url)) {
          return null
        }
      }
      return href
    }
  
    // massage <a> hrefs
    let orgLinkOpen = md.renderer.rules.link_open
    md.renderer.rules.link_open = function (tokens, idx, options /* env */) {
      var i = tokens[idx].attrs.findIndex(attr => attr[0] === 'href')
      tokens[idx].attrs[i][1] = hrefMassager(tokens[idx].attrs[i][1])
      if (orgLinkOpen) return orgLinkOpen.apply(null, arguments)
      return md.renderer.renderToken.apply(md.renderer, arguments)
    }
  
    // massage <img> srcs
    let orgImage = md.renderer.rules.image
    md.renderer.rules.image = function (tokens, idx, options /* env */) {
      var i = tokens[idx].attrs.findIndex(attr => attr[0] === 'src')
      let src = hrefMassager(tokens[idx].attrs[i][1], true)
      if (!src) return ''
      tokens[idx].attrs[i][1] = src
      if (orgImage) return orgImage.apply(null, arguments)
      return md.renderer.renderToken.apply(md.renderer, arguments)
    }

    return md
  }

  // data management
  // =

  async load () {
    var readmeInfo = this.getReadmeFileInfo()
    if (readmeInfo && (!this.readmeInfo || readmeInfo.path !== this.readmeInfo.path)) {
      this.readmeInfo = readmeInfo
      let archive = new DatArchive(this.datInfo.url)
      this.readme = await archive.readFile(readmeInfo.path, 'utf8')
    }
    if (!readmeInfo) {
      this.readmeInfo = null
      this.readme = ''
    }
  }

  // rendering
  // =

  render () {
    if (!this.readme) return html``
    var md = this.createMarkdownRenderer()
    return html`
      <div class="markdown">${unsafeHTML(md.render(this.readme))}</div>
    `
  }
}
FilesReadme.styles = [css`
.markdown {
  border-top: 1px solid var(--light-border-color);
  margin-top: 5px;
  padding: 0 20px;
}
`]

customElements.define('beaker-library-files-readme', FilesReadme)
