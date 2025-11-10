export const productos = await fetch("../data/viiajo-inventario-v2.json")
  .then(res => res.json())
  .catch(err => {
    console.error("Error al cargar inventario:", err);
    return [];
  });
