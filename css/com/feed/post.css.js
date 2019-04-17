import {css} from '../../../vendor/lit-element/lit-element.js'
import buttonscss from '../../buttons.css.js'

const cssStr = css`
${buttonscss}

:host {
  display: block;
}

a:hover {
  text-decoration: underline;
}

.inner {
  display: flex;
  background: #fff;
  padding: 14px;
}

.avatar-column {
  width: 60px;
}

.content-column {
  flex: 1;
}

.avatar {
  display: block;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.header {
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 14px;
  color: var(--color-text--muted);
}

.title {
  font-size: 15px;
  font-weight: bold;
  color: var(--color-text);
  margin-right: 5px;
}

.permalink {
  color: inherit;
  margin-left: 5px;
}

.body {
  white-space: pre-wrap;
  font-size: 14px;
  margin: 4px 0 10px;
  color: var(--color-text--dark);
  word-break: break-word;
}

.bottom-ctrls {
  display: flex;
  align-items: center;
  color: #51555f;
}

.bottom-ctrls > * {
  margin-right: 25px;
}

beaker-reactions {
  display: flex;
  min-height: 21px;
}

.reaction {
  padding: 2px 6px 0px;
  line-height: 16px;
  font-size: 10px;
  font-weight: 500;
  color: #444;
  border: 1px solid #a7acb7;
  border-radius: 12px;
  margin-right: 4px;
}

.reaction:hover {
  cursor: pointer;
  background: #f5f8ff;
}

.reaction .count {
  font-size: 12px;
}

.reaction.by-user {
  background: #f5f8ff;
  font-weight: bold;
}

.reaction.by-user:hover {
  background: #e3e9f7;
}

.reaction.add-btn {
  font-size: 16px;
  line-height: 12px;
  color: gray;
  padding-left: 4px;
  padding-right: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.bottom-ctrls:hover .reaction.add-btn {
  opacity: 1;
}

.reaction.add-btn.pressed {
  background: #e3e9f7;
  box-shadow: inset 0 2px 3px rgba(0,0,0,.05);
  opacity: 1;
}
`
export default cssStr
