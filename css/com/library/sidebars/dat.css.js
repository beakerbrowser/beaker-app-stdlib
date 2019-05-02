import {css} from '../../../../vendor/lit-element/lit-element.js'


const cssStr = css`
:host {
  display: block;
  height: 100%;
}

p {
  line-height: 1.6;
  color: rgba(0,0,0,.6);
}

.panel {
  height: calc(100vh - 50px);
  overflow: hidden;
}

.panel > :first-child {
  margin-top: 0;
}

.panel > :last-child {
  margin-bottom: 0;
}

.panel h2 {
  font-weight: 500;
}

.panel h2 span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.panel-banner {
  position: relative;
}

.panel-banner .cover {
  display: block;
  width: 100%;
  max-height: 100px;
  object-fit: cover;
  border-radius: 4px;
}

.panel-banner .thumb {
  position: absolute;
  bottom: -50px;
  left: 10px;
  width: 100px;
  max-height: 100px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid #fff;
}

.panel-body {
  padding: 10px 20px;
}

.panel-banner + .panel-body {
  padding-top: 50px; 
}
`
export default cssStr
