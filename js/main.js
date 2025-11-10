import { productos } from "./productos.js";

const menu = document.querySelector("#menu-categorias");
const subcategorias = document.querySelector("#subcategorias");
const contenedor = document.querySelector("#contenedor-productos");
const titulo = document.querySelector("#titulo-principal");
const toggleMenu = document.getElementById("toggle-menu");
const cerrarMenu = document.getElementById("cerrar-menu");
const aside = document.querySelector("aside");

// Restaurar estado del menú al cargar
if (localStorage.getItem("menuAbierto") === "true") {
  aside.classList.add("abierto");
}

// Abrir menú
toggleMenu.addEventListener("click", () => {
  aside.classList.add("abierto");
  localStorage.setItem("menuAbierto", "true");
});

// Cerrar menú
cerrarMenu.addEventListener("click", () => {
  aside.classList.remove("abierto");
  localStorage.setItem("menuAbierto", "false");
});

// Extraer categorías únicas
const categorias = [...new Set(productos.map(p => p.categoria.id))];

// Crear botones de categoría
categorias.forEach(cat => {
  const btn = document.createElement("button");
  btn.className = "boton-categoria";
  btn.textContent = cat.replace(/_/g, " ");
  btn.setAttribute("aria-label", `Filtrar por categoría ${btn.textContent}`);
  btn.tabIndex = 0;

  btn.addEventListener("click", () => mostrarCategoria(cat));

  const li = document.createElement("li");
  li.appendChild(btn);
  menu.appendChild(li);
});

function mostrarCategoria(catId) {
  const nombreCat = catId.replace(/_/g, " ");
  titulo.textContent = nombreCat;

  const filtrados = productos.filter(p => p.categoria.id === catId);
  cargarProductos(filtrados);
  mostrarSubcategorias(catId);

  // Scroll automático para móviles
  window.scrollTo({ top: titulo.offsetTop, behavior: "smooth" });

  // Ocultar menú lateral al seleccionar categoría
  aside.classList.remove("abierto");
  localStorage.setItem("menuAbierto", "false");
}

function mostrarSubcategorias(catId) {
  const subs = [...new Set(productos
    .filter(p => p.categoria.id === catId && p.subcategoria)
    .map(p => p.subcategoria.id))];

  subcategorias.innerHTML = "";

  subs.forEach(subId => {
    const nombreSub = subId.replace(/_/g, " ");
    const btn = document.createElement("button");
    btn.className = "boton-subcategoria";
    btn.textContent = nombreSub;
    btn.setAttribute("aria-label", `Filtrar por subcategoría ${nombreSub}`);
    btn.tabIndex = 0;

    btn.onclick = () => {
      const filtrados = productos.filter(p =>
        p.categoria.id === catId && p.subcategoria?.id === subId
      );
      titulo.textContent = nombreSub;
      cargarProductos(filtrados);
    };

    subcategorias.appendChild(btn);
  });
}

function cargarProductos(lista) {
  contenedor.innerHTML = "";

  if (lista.length === 0) {
    contenedor.innerHTML = `
      <div class="sin-resultados">
        <p>No hay productos disponibles en esta categoría.</p>
      </div>
    `;
    return;
  }

  lista.forEach(p => {
    const div = document.createElement("div");
    div.className = "producto no-copiar";
    //div.className = "producto";
    div.innerHTML = `
      <img src="${p.imagen || 'img/placeholder.png'}" alt="${p.titulo || 'Producto'}" />
      <h3>${p.titulo || 'Sin título'}</h3>
      <p class="descripcion">${p.descripcion || 'Sin descripción disponible'}</p>
      <p class="precio">Q${p.precio ? p.precio.toFixed(2) : '0.00'}</p>
      <button class="agregar-carrito" data-id="${p.id}">🛒 Agregar</button>
    `;
    contenedor.appendChild(div);
  });
}

// Agregar al carrito
document.addEventListener("click", e => {
  if (e.target.classList.contains("agregar-carrito")) {
    const id = e.target.dataset.id;
    const producto = productos.find(p => p.id === id);
    if (producto) {
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      carrito.push(producto);
      localStorage.setItem("carrito", JSON.stringify(carrito));
      alert(`${producto.titulo} agregado al carrito`);
    }
  }
});

// Carga inicial
cargarProductos(productos);