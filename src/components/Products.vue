<template>
  <div class="products-container">
    <div class="search-section">
      <div class="search-wrapper">
        <div class="search-input-container">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" stroke-width="2"/>
          </svg>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Buscar productos..." 
            class="search-input"
            @input="filterProducts"
          />
          <button v-if="searchQuery" @click="clearSearch" class="clear-btn">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>
        <button @click="filterProducts" class="search-btn">
          Buscar
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Cargando productos...</p>
    </div>

    <div v-else class="products-grid">
      <div v-if="filteredProducts.length === 0" class="no-products">
        <svg class="no-products-icon" viewBox="0 0 24 24" fill="none">
          <path d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-3-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2"/>
        </svg>
        <h3>No se encontraron productos</h3>
        <p v-if="searchQuery">No hay productos que coincidan con "{{ searchQuery }}"</p>
        <p v-else>No hay productos disponibles en este momento</p>
      </div>

      <ProductCard 
        v-for="product in filteredProducts" 
        :key="product.id"
        :product="product"
        @add-to-cart="handleAddToCart"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { API } from '../services/API.js'
import ProductCard from './ProductCard.vue'

export default {
  name: 'Products',
  components: {
    ProductCard
  },
  emits: ['add-to-cart'],
  setup(props, { emit }) {
    const products = ref([])
    const filteredProducts = ref([])
    const searchQuery = ref('')
    const loading = ref(true)

    const loadProducts = async () => {
      try {
        loading.value = true
        
        const data = await API.Products.all()
        products.value = data
        filteredProducts.value = data
        
      } catch (error) {
        console.error('Error al cargar productos:', error)
        products.value = []
        filteredProducts.value = []
      } finally {
        loading.value = false
      }
    }

    const filterProducts = () => {
      if (!searchQuery.value.trim()) {
        filteredProducts.value = products.value
        return
      }

      const query = searchQuery.value.toLowerCase().trim()
      filteredProducts.value = products.value.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      )
    }

    const clearSearch = () => {
      searchQuery.value = ''
      filteredProducts.value = products.value
    }

    const handleAddToCart = (productData) => {
      emit('add-to-cart', productData)
    }

    onMounted(() => {
      loadProducts()
    })

    return {
      products,
      filteredProducts,
      searchQuery,
      loading,
      filterProducts,
      clearSearch,
      handleAddToCart
    }
  }
}
</script>

<style scoped>
.products-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.search-section {
  margin-bottom: 3rem;
}

.search-wrapper {
  display: flex;
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

.search-input-container {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  width: 20px;
  height: 20px;
  color: #6b7280;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 25px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.clear-btn {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  color: #6b7280;
  transition: color 0.2s ease;
}

.clear-btn:hover {
  color: #ef4444;
}

.clear-btn svg {
  width: 18px;
  height: 18px;
}

.search-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.search-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.no-products {
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.no-products-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  color: #d1d5db;
}

.no-products h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #374151;
}

.no-products p {
  font-size: 1rem;
  max-width: 400px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .products-container {
    padding: 1rem;
  }

  .search-wrapper {
    flex-direction: column;
  }

  .products-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .search-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>