import {css} from '../../../vendor/lit-element/lit-element.js'
import buttonscss from '../../buttons.css.js'
import reactionscss from '../reactions/reactions.css.js'

const cssStr = css`
${buttonscss}
${reactionscss}

:host {
  display: block;
  cursor: pointer;

  --body-font-size: 15px;
  --header-font-size: 12px;
  --title-font-size: 12px;
  --inner-width: initial;
  --footer-background: #f4f8ff;
  --blue-border-color: #afcaff;
  --light-blue-border-color: #dae5fb;

  border: 1px solid var(--blue-border-color);
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
}

a:hover {
  text-decoration: underline;
}

.inner {
  display: flex;
  align-items: center;
  width: var(--inner-width);
}

.content-column {
  flex: 1;
  overflow: hidden;
}

.avatar.icon {
  display: inline-block;
  border-radius: 50%;
  object-fit: cover;
  width: 16px;
  height: 16px;
  vertical-align: middle;
  position: relative;
  top: -1px;
}

.footer {
  display: flex;
  align-items: center;
  font-size: var(--header-font-size);
  color: rgb(96, 123, 173);
  background: var(--footer-background);
  padding: 6px 20px;
}

.footer a {
  margin: 0 5px;
}

.footer a:first-child {
  margin-left: 0;
}

.title {
  font-size: var(--title-font-size);
  font-weight: 500;
  color: #355188;
  margin-left: 0;
  font-weight: 500;
  line-height: 17px;
}

.permalink {
  color: inherit;
}

.comments {
  font-weight: 500;
  width: 80px;
}

.body {
  color: rgba(0, 0, 0, 0.9);
  padding: 16px 20px;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: var(--body-font-size);
  line-height: 1.4;
  white-space: pre-line;
  border-bottom: 1px solid var(--light-blue-border-color);
}

.embed {
  display: flex;
  padding: 10px 20px;
  border-bottom: 1px solid var(--light-blue-border-color);
}

.embed img {
  display: block;
  width: 90px;
  border-radius: 4px;
}

.embed .embed-details {
  padding: 10px 26px;
}

.embed .embed-details > * {
  margin: 4px 0;
}

.embed .embed-title {
  font-size: 16px;
  font-weight: bold;
}

.embed .embed-description {
  color: var(--color-text--muted);
}
`
export default cssStr
