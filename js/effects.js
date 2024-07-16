function agregarEfectoBounce(element) {
  agregarEfecto(element, "animate__bounce");
}

function agregarEfectoSlideDown(element) {
  agregarEfecto(element, "animate__slideInDown");
}

function agregarEfectoFadeUp(element) {
  element.classList.add("cart-item-removed");
  agregarEfecto(element, "animate__fadeOutUp");
}

function agregarEfecto(element, efecto) {
  element.classList.add("animate__animated", efecto);

  element.addEventListener(
    "animationend",
    function () {
      element.classList.remove("animate__animated", efecto);
    },
    { once: true }
  );
}
