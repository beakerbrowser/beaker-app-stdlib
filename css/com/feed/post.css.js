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
  width: 64px;
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
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 14px;
  color: var(--color-text--muted);
}

.title {
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
  color: var(--color-text--dark);
  word-break: break-word;
}

beaker-reactions {
  margin-left: auto;
  display: inline-flex;
  min-height: 21px;
}

.inner:hover beaker-reactions .reaction.add-btn {
  visibility: visible;
}

.reaction {
  padding: 3px 6px 2px;
  line-height: 16px;
  font-size: 10px;
  color: #444;
}

.reaction:hover {
  cursor: pointer;
  background: #f5f5f5;
}

.reaction .count {
  font-size: 12px;
}

.reaction.by-user {
  background: #f5f5f5;
  font-weight: bold;
}

.reaction.by-user:hover {
  background: #eee;
}

.reaction.add-btn {
  font-size: 16px;
  line-height: 12px;
  color: #aaa;
  padding-left: 6px;
  padding-right: 6px;
  border-right: 0;
  visibility: hidden;
}

.reaction.add-btn.pressed {
  background: #eee;
  box-shadow: inset 0 2px 3px rgba(0,0,0,.05);
}
`
export default cssStr
