class API {
  static products = [
    {
      id: 1,
      name: 'Laptop Gaming ROG',
      price: 1299.99,
      stock: 5,
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300&h=200&fit=crop',
      description: 'Laptop gaming de alta performance con RTX 4060'
    },
    {
      id: 2,
      name: 'iPhone 15 Pro',
      price: 1199.99,
      stock: 12,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=200&fit=crop',
      description: 'El último iPhone con chip A17 Pro'
    },
    {
      id: 3,
      name: 'MacBook Air M3',
      price: 1399.99,
      stock: 8,
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&h=200&fit=crop',
      description: 'MacBook Air con el nuevo chip M3'
    },
    {
      id: 4,
      name: 'Samsung Galaxy S24',
      price: 899.99,
      stock: 15,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop',
      description: 'Smartphone Android premium con IA'
    },
    {
      id: 5,
      name: 'iPad Pro 12.9"',
      price: 1099.99,
      stock: 6,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=200&fit=crop',
      description: 'iPad Pro con chip M2 y pantalla Liquid Retina'
    },
    {
      id: 6,
      name: 'AirPods Pro 2',
      price: 249.99,
      stock: 20,
      image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300&h=200&fit=crop',
      description: 'Auriculares inalámbricos con cancelación de ruido'
    },
    {
      id: 7,
      name: 'PlayStation 5',
      price: 499.99,
      stock: 3,
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=300&h=200&fit=crop',
      description: 'Consola de videojuegos de nueva generación'
    },
    {
      id: 8,
      name: 'Nintendo Switch OLED',
      price: 349.99,
      stock: 10,
      image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=300&h=200&fit=crop',
      description: 'Consola híbrida con pantalla OLED'
    }
  ];

  static all() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.products]);
      }, 500);
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const product = this.products.find(p => p.id === parseInt(id));
        if (product) {
          resolve({...product});
        } else {
          reject(new Error('Producto no encontrado'));
        }
      }, 200);
    });
  }
}

export default API;