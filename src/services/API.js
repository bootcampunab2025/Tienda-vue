const BASE_URL = "http://localhost:3001";

export const API = {
  Products: {
    all() {
      return new Promise(async (resolve, reject) => {
        try {
          const response = await fetch(`${BASE_URL}/products`);
          if (!response.ok) {
            throw new Error('Error al cargar productos');
          }
          const products = await response.json();
          setTimeout(() => {
            resolve(products);
          }, 500);
        } catch (error) {
          reject(error);
        }
      });
    }
  }
};

export class Products {
  static async getAll() {
    try {
      const res = await fetch(`${BASE_URL}/products`);
      if (!res.ok) throw new Error("Error al obtener productos");
      const data = await res.json();
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  static async getById(id) {
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
