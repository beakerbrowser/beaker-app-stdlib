import {html} from '../../vendor/lit-element/lit-element.js'
import * as contextMenu from './context-menu.js'

export function create ({x, y}) {
  return contextMenu.create({
    x,
    y,
    render () {
      return html`
        <style>
          .appmenu {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            padding: 20px 20px;
          }
          .appmenu .dropdown-item {
            font-size: 14px;
            text-align: center;

            /* all same dimensions */
            padding: 7px 15px;
            width: 80px;
            line-height: 40px;
            
            /* remove link styles */
            color: #444;
            text-decoration: none;

            /* remove dropdown-item border */
            border: 0;
          }
          .appmenu .dropdown-item img {
            width: 32px;
            height: 32px;

            /* center */
            display: block;
            margin: 0 auto;
          }
          .appmenu .dropdown-item img.profile {
            border-radius: 50%;
          }
        </style>
        <div class="appmenu dropdown-items right">
          <a class="dropdown-item" href="beaker://bookmarks">
            <img src="/vendor/beaker-app-stdlib/img/icons/bookmarks.png">
            Bookmarks
          </a>
          <a class="dropdown-item" href="beaker://library">
            <img src="/vendor/beaker-app-stdlib/img/icons/library.png">
            Library
          </a>
          <a class="dropdown-item" href="beaker://search">
            <img src="/vendor/beaker-app-stdlib/img/icons/search.png">
            Search
          </a>
          <a class="dropdown-item" href="intent:unwalled.garden/view-feed">
            <img src="/vendor/beaker-app-stdlib/img/icons/newsfeed.png">
            Beaker.Social
          </a>
        </div>
      `
    }
  })
}