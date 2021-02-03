export function replaceElement(target, element) {
  target.replaceWith(element);
  return element;
}

export function firstElement(element) {
  return element.firstElementChild;
}
