import { firstElement } from "./utils/dom.js";
import App from "./app/app.js";

const ready = () => {
  return new Promise((resolve) => {
    document.addEventListener("DOMContentLoaded", () => {
      const el = document.getElementById("app");
      resolve(firstElement(el));
    });
  });
};

const start = async () => {
  const el = await ready();
  const app = new App(el);
  app.render();
  app.update();
};
start();
