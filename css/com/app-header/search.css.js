import {css} from '../../../vendor/lit-element/lit-element.js'
import commoncss from '../../common.css.js'
import searchinputcss from '../search-input.css.js'
import autocompletecss from '../autocomplete.css.js'

const cssStr = css`
${commoncss}
${searchinputcss}
${autocompletecss}

.search-container,
input.search {
  position: relative;
  width: 400px;
  height: 36px;
  font-size: 15px;
}

.search-container > .fa-search {
  font-size: 15px;
  left: 14px;
  top: 10px;
}

input.search::-webkit-input-placeholder {
  font-size: 15px;
}
`
export default cssStr
