import { html, css } from "lit-element";

export default function view(items) {
  return html`<p>Hello ${items[0]}!</p>`;
}
