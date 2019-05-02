import {css} from '../../../vendor/lit-element/lit-element.js'
import colorscss from '../../colors.css.js'
import searchinputcss from '../search-input.css.js'

const cssStr = css`
${colorscss}
${searchinputcss}

:host {
  display: block;
  height: 100vh;
}

.header {
  background: #fff;
  height: 45px;
  padding: 20px 20px 5px;
  overflow: hidden ;
}

.path {
  display: flex;
  align-items: center;
  white-space: nowrap;
  color: #555;
  user-select: none;
  background: #f9f9fa;
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
  height: 30px;
  padding: 0 20px 10px;
  margin-bottom: 5px;
  border-bottom: 1px solid var(--light-border-color);
}

.main {
  position: relative;
}

.list > * {
  display: block;
  height: calc(100vh - 160px);
}

.list.with-path > * {
  height: calc(100vh - 185px);
}

.main /*.with-sidebar*/ {
  display: grid;
  grid-template-columns: calc(100vw - 560px) 360px;
}

.main > :first-child {
  border-right: 1px solid var(--light-border-color);
}

.sidebar {
  background: #fff;
  padding: 10px;
}

/* header styles */

.header h2 {
  font-size: 27px;
  margin: 0;
  font-weight: 500
}

.header h2 i,
.header h2 .favicon {
  margin-right: 3px;
}

.header h2 .favicon {
  width: 32px;
  height: 32px;
  object-fit: cover;
  vertical-align: bottom;
}

.header p {
  line-height: 1.6;
  color: rgba(0,0,0,.6);
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

`
export default cssStr
