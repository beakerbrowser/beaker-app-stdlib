import {css} from '../../../vendor/lit-element/lit-element.js'


const cssStr = css`

.reaction {
  padding: 4px 4px 3px;
  margin-right: 4px;
  font-size: 13px;
  font-weight: 500;
  color: #444;
  /*border: 1px solid var(--light-border-color);*/
  border-radius: 16px;
}

.reaction:hover {
  cursor: pointer;
  background: #f5f5f5;
}

.reaction .count {
  /* font-size: 11px; */
}

.reaction.by-user {
  background: #f5f5f5;
  font-weight: bold;
}

.reaction.by-user:hover {
  background: #e5e5e5;
}

.reaction.add-btn {
  border: 0;
  font-size: 12px;
  line-height: 21px;
  color: #888;
}

.reaction.add-btn.pressed {
  background: #e5e5e5;
  box-shadow: inset 0 2px 3px rgba(0,0,0,.05);
  opacity: 1;
}
`
export default cssStr
