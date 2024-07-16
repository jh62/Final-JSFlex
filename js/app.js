document.addEventListener("DOMContentLoaded", () => {
  crearContenedorToast();
  fetchProductos();
  verCarrito();
  document.getElementById("checkout-btn").addEventListener("click", finalizarCompra);
  document.getElementById("cart-icon").addEventListener("click", mostrarCarrito);
});

async function fetchProductos() {
  try {
    const response = await fetch("bd/products.json");
    const products = await response.json();
    localStorage.setItem("products", JSON.stringify(products));
    mostrarProductos(products);
  } catch (error) {
    console.error("Error al cargar los productos:", error);
  }
}

function mostrarProductos(products) {
  const productList = document.getElementById("product-list");
  for (let i = 0; i < 12; i++) {
    const product = products[i % products.length];
    const productCard = document.createElement("div");
    productCard.className = "col-md-2";
    productCard.innerHTML = `
              <div class="card mb-4">
                  <img src="${product.image}" class="card-img-top" alt="${product.name}">
                  <div class="card-body">
                      <h5 class="card-title">${product.name}</h5>
                      <p class="card-text">${product.description}</p>
                      <p class="card-text">$${product.price}</p>
                      <button class="btn btn-primary add-to-cart" data-id="${product.id}">Agregar al Carrito</button>
                  </div>
              </div>
          `;
    productList.appendChild(productCard);
  }

  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", insertarItem);
  });
}

function insertarItem(event) {
  const productId = event.target.getAttribute("data-id");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length < 20) {
    cart.push(productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    actualizarCarrito();
    mostrarToast("Producto agregado al carrito");
  } else {
    mostrarToast("No es posible entregar más de 20 productos por domicilio");
  }
}

function actualizarCarrito() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  document.getElementById("cart-count").innerText = cart.length;
}

function verCarrito() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length > 0) {
    mostrarToast("Aún tiene una compra pendiente");
  }
  actualizarCarrito();
}

function finalizarCompra() {
  const address = document.getElementById("address").value;
  if (address.trim() === "") {
    mostrarToast("Por favor ingrese una dirección");
  } else {
    localStorage.removeItem("cart");
    actualizarCarrito();
    $("#cartModal").modal("hide");
    mostrarToast("Gracias por su compra");
  }
}

function crearContenedorToast() {
  const toastContainer = document.createElement("div");
  toastContainer.className = "toast-container";
  document.body.appendChild(toastContainer);
}

function mostrarToast(message) {
  const toastContainer = document.querySelector(".toast-container");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
          <div class="toast-header">
              <strong class="mr-auto">Aviso</strong>
              <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
              </button>
          </div>
          <div class="toast-body">
              ${message}
          </div>
      `;
  toastContainer.appendChild(toast);
  $(toast).toast({ delay: 3000 });
  $(toast).toast("show");
  toast.addEventListener("hidden.bs.toast", () => {
    toast.remove();
  });
}

function mostrarCarrito() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";

  let total = 0;

  cart.forEach((productId) => {
    const product = products.find((p) => p.id == productId);
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
          <p>${product.name} - $${product.price}</p>
      `;
    cartItems.appendChild(cartItem);
    total += product.price;
  });

  document.getElementById("total-amount").innerText = `Total: $${total}`;
}
