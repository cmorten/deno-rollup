import { replaceElement } from "../utils/dom.js";
import view from "./views.js";
import data from "../data/data.js";

export default class App {
  constructor(root) {
    this.root = root;
  }

  render() {
    const items = data();
    const el = view(items);
    this.root = replaceElement(this.root, el);
  }

  update() {
    setInterval(() => {
      this.render();
    }, 1000);
  }
}
