import {css} from '../../../vendor/lit-element/lit-element.js'
import colorscss from '../../colors.css.js'
import searchinputcss from '../search-input.css.js'

const cssStr = css`
${colorscss}
${searchinputcss}

:host {
  display: grid;
  grid-template-columns: calc(100vw - 500px) 300px;
}

.main {
  height: 100vh;
}

.sidebar {
  background: #fff;
  border-left: 1px solid var(--border-color);
}

.path {
  display: flex;
  align-items: center;
  white-space: nowrap;
  border-bottom: 1px solid var(--border-color);
  background: #f9f9fa;
  color: #555;
  user-select: none;
}

.path > div {
  padding: 4px 0px 4px 10px;
}

.path > div:not(:last-child):after {
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
  content: "\\f105";
  color: #aaa;
  font-size: 11px;
  padding-left: 10px;
}

.toolbar {
  display: flex;
  align-items: center;
  background: #f9f9fa;
  padding: 0 10px;
  height: 40px;
  border-bottom: 1px solid var(--border-color);
}

.sidebar {
  padding: 20px;
}

/* toolbar styles */

.spacer {
  flex: 1;
}

.search-container,
input.search {
  position: relative;
  font-size: 13px;
}

.search-container input.search {
  background: #fff;
  border-radius: 16px;
  border: 1px solid var(--border-color);
  outline: 0;
  padding-left: 30px;
  height: 26px;
  width: 160px;
}

.search-container > i.fa-search {
  font-size: 13px;
  left: 11px;
  top: 9px;
}

.toolbar button {
  background: #fff;
  border: 1px solid var(--border-color);
  border-radius: 3px;
  box-shadow: 0 1px 1px rgba(0,0,0,.05);
  padding: 5px 10px;
  color: #333;
  outline: 0;
}

.toolbar button:active {
  background: #eee;
}

.toolbar button.pressed {
  box-shadow: inset 0 1px 1px rgba(0,0,0,.5);
  background: #6d6d79;
  color: rgba(255,255,255,1);
  border-color: transparent;
  border-radius: 4px;
}

.toolbar button[disabled] {
  color: #999;
}

.toolbar .radio-group button {
  background: transparent;
  border: 0;
  box-shadow: none;
}

.toolbar .radio-group button.pressed {
  background: #6d6d79;
  border-radius: 30px;
}

.toolbar .btn-group {
  display: flex;
  margin: 0 6px;
}

.toolbar .btn-group button {
  border-radius: 0;
  border-right-width: 0;
}

.toolbar .btn-group button:first-child {
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
}

.toolbar .btn-group button:last-child {
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  border-right-width: 1px;
}

.list > * {
  display: block;
  height: calc(100vh - 100px);
}

.list.with-path > * {
  height: calc(100vh - 125px);
}
`
export default cssStr
