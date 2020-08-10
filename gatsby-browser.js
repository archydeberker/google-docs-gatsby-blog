// custom typefaces
import "typeface-montserrat"
import "typeface-merriweather"

import "prismjs/themes/prism.css"

import littlefoot from "littlefoot"
require("littlefoot/dist/littlefoot.css")

export function onRouteUpdate() {
  littlefoot({
    activateOnHover: true,
    buttonTemplate: `<button
    aria-controls="fncontent:<% id %>"
    aria-expanded="false"
    aria-label="Footnote <% number %>"
    class="littlefoot-footnote__button"
    id="<% reference %>"
    rel="footnote"
    title="See Footnote <% number %>"
  />
    <% number %>
  </button>`,
  }) // Pass any littlefoot settings here.
}
