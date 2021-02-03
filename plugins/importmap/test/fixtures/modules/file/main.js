import { html } from "lit-html/lit-html";
import { css } from "lit-html";
import { LitElement } from "lit-element";

export default class Inner extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          color: red;
        }
      `,
    ];
  }

  render(world) {
    return html`<p>Hello ${world}!</p>`;
  }
}
