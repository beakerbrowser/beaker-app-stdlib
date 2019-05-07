import {css} from '../../../vendor/lit-element/lit-element.js'
import buttonscss from '../../buttons.css.js'
import reactionscss from '../reactions/reactions.css.js'

const cssStr = css`
${buttonscss}
${reactionscss}

:host {
  display: block;
  --body-font-size: 17px;
  --header-font-size: 12px;
  --title-font-size: 12px;
  --avatar-size: 50px;
  --thumb-col-width: 80px;
  --inner-width: initial;
}

a:hover {
  text-decoration: underline;
}

.inner {
  display: flex;
  align-items: center;
  width: var(--inner-width);
}

.thumb-column {
  width: var(--thumb-col-width);
  padding-right: 16px;
  box-sizing: content-box;
}

.content-column {
  flex: 1;
}

.thumb-column > * {
  width: 100%;
  max-height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.thumb-column .icon {
  background: #f5f5f7;
  font-size: 36px;
  color: rgba(0,0,0,.2);
  text-align: center;
  line-height: 60px;
}

.avatar {
  display: block;
  width: var(--avatar-size);
  height: var(--avatar-size);
  border-radius: 50%;
  object-fit: cover;
}

.avatar.icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  vertical-align: middle;
}

.header {
  display: flex;
  align-items: center;
  font-size: var(--header-font-size);
  color: rgb(118, 125, 138);
  margin: 4px 0;
}

.header a {
  margin: 0 5px;
}

.header a:first-child {
  margin-left: 0;
}

.title {
  font-size: var(--title-font-size);
  font-weight: 500;
  color: var(--color-text);
  margin-left: 0;
  font-weight: 500;
}

.permalink {
  color: inherit;
}

.comments {
  font-weight: 500;
  width: 86px;
}

.body {
  font-size: var(--body-font-size);
  line-height: 1.2;
  color: var(--color-text);
  word-break: break-word;
  padding-right: 10px;
  margin: 4px 0 8px;
}

.bottom-ctrls {
  display: flex;
  align-items: center;
  color: #51555f;
}

.bottom-ctrls > * {
  margin-right: 30px;
}

.bottom-ctrls > div a {
  font-size: 13px;
  color: rgb(118, 125, 138);
  letter-spacing: -0.4px;
  cursor: pointer;
  font-weight: 500;
}

`
export default cssStr
