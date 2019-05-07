import {css} from '../../../vendor/lit-element/lit-element.js'
import colorscss from '../../colors.css.js'

const cssStr = css`
${colorscss}

.heading,
.row {
  display: flex;
  padding: 0 20px;
  justify-content: flex-start;
  align-items: center;
  cursor: default;
  user-select: none;
}

.heading {
  font-size: 10px;
  color: rgba(0,0,0,.35);
  height: 10px;
  padding: 6px 20px 8px;
  border-bottom: 1px solid var(--light-border-color);
}

.heading span {
  cursor: pointer;
}

.rows {
  height: 100%;
  overflow: auto;
  padding: 5px 0 25px;
}

.row {
  height: 34px;
  background: #fff;
}

.row:hover {
  background: #f9f9fa;
}

.row.selected {
  background: #427ffb;
}

a.row {
  text-decoration: none;
  color: inherit;
}

.col {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 5px;
  vertical-align: middle;
}

.row .col {
  color: #666;
}

.row .col:first-child,
.row .col.name,
.row .col.title {
  color: #222;
}

.row em {
  color: #aaa;
  font-weight: 300;
}

.row strong {
  font-weight: 500;
}

.row.selected .col,
.row.selected .col * {
  color: #fff;
}

.site {
  display: flex;
  align-items: center;
}

.thumb,
.site img {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 5px;
}

.favicon {
  width: 16px;
  height: 16px;
  object-fit: cover;
}

.group-label {
  padding: 14px 8px 4px;
  margin: 0 6px 6px;
  color: rgba(0,0,0,.6);
  font-size: 17px;
  font-weight: 500;
}

.col.primary-action button,
.col.hover-action button {
  background: none;
  border: 0;
  outline: 0;
  padding: 0;
  font-size: 14px;
}

button.blue {
  color: var(--blue);
}

button.hover {
  opacity: 0;
}

.row:hover button.hover {
  opacity: 1;
}
`
export default cssStr
