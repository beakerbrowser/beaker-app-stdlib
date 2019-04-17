import {css} from '../../../vendor/lit-element/lit-element.js'


const cssStr = css`
:host {
  display: flex;
  flex-wrap: wrap;
  min-height: 23px;
}

.reaction {
  padding: 4px 4px 3px;
  border-radius: 4px;
  margin-right: 5px;
  line-height: 16px;
}

.reaction:hover {
  cursor: pointer;
  background: #f5f5f5;
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
  color: gray;
  padding-left: 6px;
  padding-right: 6px;
}

.reaction.add-btn.pressed {
  background: #eee;
  box-shadow: inset 0 2px 3px rgba(0,0,0,.05);
}

.emoji {
  width: 16px;
  height: 16px;
  vertical-align: bottom;
}
`
export default cssStr
