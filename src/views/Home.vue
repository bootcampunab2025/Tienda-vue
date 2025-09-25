<template>
  <div class="home-view">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          Bienvenido a 
          <span class="brand-name">TechStore</span>
        </h1>
        <p class="hero-subtitle">
          Descubre la última tecnología con los mejores precios del mercado
        </p>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-number">{{ products.length }}</span>
            <span class="stat-label">Productos</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ totalStock }}</span>
            <span class="stat-label">En Stock</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">24/7</span>
            <span class="stat-label">Soporte</span>
          </div>
        </div>
      </div>
    </div>

    <div class="products-section">
      <Products @add-to-cart="handleAddToCart" />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import Products from '../components/Products.vue'
import API from '../services/API.js'

export default {
  name: 'Home',
  components: {
    Products
  },
  emits: ['add-to-cart'],
  setup(props, { emit }) {
    const products = ref([])

    const totalStock = computed(() => {
      return products.value.reduce((total, product) => total + product.stock, 0)
    })

    const loadProducts = async () => {
      try {
        const data = await API.all()
        products.value = data
      } catch (error) {
        console.error('Error al cargar productos:', error)
      }
    }

    const handleAddToCart = (productData) => {
      emit('add-to-cart', productData)
    }

    onMounted(() => {
      loadProducts()
    })

    return {
      products,
      totalStock,
      handleAddToCart
    }
  }
}
</script>

<style scoped>
.home-view {
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20"><defs><radialGradient id="a" cx="50%" cy="40%" r="50%"><stop offset="0%" stop-color="white" stop-opacity="0.1"/><stop offset="100%" stop-color="white" stop-opacity="0"/></radialGradient></defs><circle cx="20" cy="10" r="3" fill="url(%23a)"/><circle cx="80" cy="15" r="2" fill="url(%23a)"/><circle cx="40" cy="5" r="2" fill="url(%23a)"/><circle cx="90" cy="8" r="1" fill="url(%23a)"/><circle cx="10" cy="15" r="1" fill="url(%23a)"/></svg>');
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateX(0) translateY(0); }
  25% { transform: translateX(10px) translateY(-10px); }
  50% { transform: translateX(-5px) translateY(5px); }
  75% { transform: translateX(5px) translateY(-5px); }
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.1;
}

.brand-name {
  background: linear-gradient(45deg, #fbbf24, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from { filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.5)); }
  to { filter: drop-shadow(0 0 20px rgba(251, 191, 36, 0.8)); }
}

.hero-subtitle {
  font-size: clamp(1.1rem, 2.5vw, 1.5rem);
  margin-bottom: 3rem;
  opacity: 0.9;
  line-height: 1.6;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-width: 120px;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  color: #fbbf24;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.8;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.products-section {
  background: #f8fafc;
  min-height: 100vh;
  padding: 2rem 0;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-section {
    padding: 3rem 1rem;
  }

  .hero-stats {
    gap: 1.5rem;
  }

  .stat-item {
    min-width: 100px;
    padding: 0.75rem;
  }

  .stat-number {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .hero-stats {
    flex-direction: column;
    align-items: center;
  }

  .stat-item {
    width: 100%;
    max-width: 200px;
  }
}
</style>