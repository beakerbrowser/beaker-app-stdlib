import {css} from '../../../vendor/lit-element/lit-element.js'
import inputscss from '../../inputs.css.js'
import buttons2css from '../../buttons2.css.js'

const cssStr = css`
${inputscss}
${buttons2css}

:host {
  display: block;
  background: #fff;
  padding: 14px 18px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  overflow: hidden;
}

.input-placeholder,
textarea {
  padding: 0;
  font-size: 14px;
}

textarea::-webkit-input-placeholder {
  line-height: inherit;
  font-size: 14px;
}

.input-placeholder {
  cursor: text;
  color: #aaa;
  font-weight: 400;
}

textarea {
  display: block;
  width: 100%;
  box-sizing: border-box;
  height: auto;
  min-height: 55px;
  margin-bottom: 10px;
  resize: none;
  border: 0 !important;
  outline: 0 !important;
  box-shadow: none !important;
}

.actions {
  display: flex;
  align-items: center;
}

.actions .char-count {
  margin-left: auto;
  margin-right: 10px;
}

.actions .char-count.danger {
  color: var(--red);
}
`
export default cssStr
