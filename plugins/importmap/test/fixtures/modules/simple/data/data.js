function random(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

export default function data() {
  return [
    random(0, 20),
    random(20, 40),
    random(40, 60),
    random(60, 80),
    random(80, 100),
  ];
}
