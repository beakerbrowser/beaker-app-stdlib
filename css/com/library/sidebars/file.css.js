import {css} from '../../../../vendor/lit-element/lit-element.js'


const cssStr = css`
.file-info > * {
  max-width: 100%;
}

.file-info > :first-child {
  margin-top: 0;
}

.name {
  word-break: break-word;
}

.preview {
  max-height: 400px;
  font-size: 11px;
  border: 1px solid var(--border-color);
  padding: 4px;
  border-radius: 2px;
  overflow: hidden;
}
`
export default cssStr
