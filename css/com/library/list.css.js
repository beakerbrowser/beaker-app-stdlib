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
  height: 28px;
  background: #f9f9fa;
  border-bottom: 1px solid var(--border-color);
}

.heading span {
  cursor: pointer;
}

.rows {
  height: 100%;
  overflow: auto;
  padding-bottom: 30px; /* always include some extra space at the bottom */
}

.row {
  height: 34px;
  background: #fff;
}

.row:nth-child(even) {
  background: #f9f9fa;
}

.row.selected {
  background: var(--blue);
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
  color: gray;
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
`
export default cssStr
