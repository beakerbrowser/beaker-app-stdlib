import {css} from '../../vendor/lit-element/lit-element.js'


const cssStr = css`
:host {
  --app-header--width: 960px;
  --app-header--height: 50px;

  display: block;
  background: #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, .25);
  position: relative;
  z-index: 1;
}

:host > div {
  display: flex;
  width: var(--app-header--width);
  height: var(--app-header--height);
  margin: 0 auto;
  align-items: center;
}

a {
  margin-left: 26px;
  font-size: 16px;
  font-weight: 300;
  color: #555;
  text-decoration: none;
  cursor: pointer;
}

a:hover {
  color: #777;
}

a.todo {
  cursor: default;
  color: #aaa;
}

a.todo:hover {
  position: relative;
}

a.todo:hover:after {
  content: 'TODO';
  position: absolute;
  left: -10px;
  top: 2px;
  font-size: 12px;
  font-weight: bold;
  color: #222;
  text-shadow: 0 0 3px #fff;
}

.spacer {
  flex: 1;
}

img.profile {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}
`
export default cssStr
