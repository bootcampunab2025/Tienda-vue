const BASE_URL = "http://localhost:3001"; // URL de tu JSON Server

class API {
  // Obtener todos los productos
  static async all() {
    try {
      const res = await fetch(`${BASE_URL}/products`);
      if (!res.ok) throw new Error("Error al obtener los productos");
      const data = await res.json();
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // Obtener un producto por ID
  static async findById(id) {
    try {
      const res = await fetch(`${BASE_URL}/products/${id}`);
      if (!res.ok) throw new Error("Producto no encontrado");
      const data = await res.json();
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // Opcional: agregar un nuevo producto
  static async create(product) {
    try {
      const res = await fetch(`${BASE_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error("Error al crear el producto");
      const data = await res.json();
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // Opcional: actualizar un producto
  static async update(id, product) {
    try {
      const res = await fetch(`${BASE_URL}/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error("Error al actualizar el producto");
      const data = await res.json();
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // Opcional: eliminar un producto
  static async delete(id) {
    try {
      const res = await fetch(`${BASE_URL}/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar el producto");
      return { message: "Producto eliminado correctamente" };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

export default API;
