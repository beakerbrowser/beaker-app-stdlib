import {css} from '../../vendor/lit-element/lit-element.js'
import buttons2css from '../buttons2.css.js'

const cssStr = css`
${buttons2css}

:host {
  display: block;
}

:host([fullheight]) .listing {
  height: calc(100vh - 118px);
  overflow-y: auto;
}

.toolbar {
  display: flex;
  align-items: center;
  height: 30px;
  background: #f5f5f5;
  border-bottom: 1px solid #bbb;
  padding-left: 5px;
}

.toolbar button {
  padding: 3px 8px;
}

.toolbar .text {
  overflow: hidden;
  text-overflow: ellipsis;
}

.toolbar .spacer {
  flex: 1;
}

.path {
  display: flex;
  align-items: center;
  padding: 0 4px;
  font-size: 12px;
  color: gray;
  overflow-x: auto;
  white-space: nowrap;
}

.path a {
  padding: 4px;
  cursor: pointer;
}

.path a:hover {
  background: #eee;
}

.path .fa-angle-right {
  padding: 2px;
}

.listing .item {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  cursor: pointer;
}

.listing .item:hover {
  background: #fafafa;
}

.listing .item .icon {
  padding-right: 6px;
}

.listing .item .name {
  flex: 1;
  word-break: break-all;
}

.listing .item .size {
  color: rgba(0,0,0,.5);
}

@media (max-width: 600px) {
  .toolbar .btn-label {
    display: none;
  }
}

@media (min-width: 601px) {
  .tooltip-onsmall[data-tooltip]:hover:after,
  .tooltip-onsmall[data-tooltip]:hover:before {
    display: none;
  }
}
`
export default cssStr
