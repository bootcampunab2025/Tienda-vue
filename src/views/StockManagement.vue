<template>
  <div class="stock-management">
    <div class="container">
      <div class="header">
        <h1>Gestión de Inventario</h1>
        <p>Administra el stock de productos de la tienda</p>
      </div>

      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Cargando productos...</p>
      </div>

      <div v-else class="products-table">
        <div class="table-header">
          <div class="search-section">
            <div class="search-wrapper">
              <svg class="search-icon" viewBox="0 0 24 24" fill="none">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" stroke-width="2"/>
              </svg>
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Buscar productos por nombre..." 
                class="search-input"
                @input="filterProducts"
              />
            </div>
          </div>
        </div>

        <div class="table-container">
          <table class="products-table-grid">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Producto</th>
                <th>Precio</th>
                <th>Stock Actual</th>
                <th>Nuevo Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in filteredProducts" :key="product.id" class="product-row">
                <td class="image-cell">
                  <img :src="product.image" :alt="product.name" class="product-image" />
                </td>
                <td class="product-info">
                  <h3>{{ product.name }}</h3>
                  <p>{{ product.description }}</p>
                </td>
                <td class="price-cell">
                  {{ formatCurrency(product.price) }}
                </td>
                <td class="stock-cell">
                  <span class="stock-badge" :class="getStockClass(product.stock)">
                    {{ product.stock }}
                  </span>
                </td>
                <td class="input-cell">
                  <div class="stock-input-group">
                    <button 
                      @click="decrementStock(product.id)" 
                      class="stock-btn minus"
                      :disabled="(editedStocks[product.id] || product.stock) <= 0"
                    >
                      -
                    </button>
                    <input 
                      v-model.number="editedStocks[product.id]" 
                      type="number" 
                      min="0" 
                      max="9999"
                      class="stock-input"
                      :placeholder="product.stock.toString()"
                    />
                    <button 
                      @click="incrementStock(product.id)" 
                      class="stock-btn plus"
                      :disabled="(editedStocks[product.id] || product.stock) >= 9999"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td class="actions-cell">
                  <button 
                    @click="updateStock(product)" 
                    class="update-btn"
                    :disabled="!hasChanges(product) || updating[product.id]"
                  >
                    <svg v-if="updating[product.id]" class="loading-icon" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"/>
                    </svg>
                    <svg v-else viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    {{ updating[product.id] ? 'Actualizando...' : 'Actualizar' }}
                  </button>
                  <button 
                    @click="resetStock(product.id)" 
                    class="reset-btn"
                    :disabled="!hasChanges(product)"
                  >
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" stroke-width="2"/>
                      <path d="M3 3v5h5" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    Reset
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="filteredProducts.length === 0" class="no-products">
          <svg class="no-products-icon" viewBox="0 0 24 24" fill="none">
            <path d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-3-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2"/>
          </svg>
          <h3>No se encontraron productos</h3>
          <p v-if="searchQuery">No hay productos que coincidan con "{{ searchQuery }}"</p>
          <p v-else>No hay productos disponibles</p>
        </div>
      </div>

      <!-- Acciones Globales -->
      <div class="global-actions" v-if="products.length > 0">
        <button @click="bulkUpdateStock" class="bulk-update-btn" :disabled="!hasPendingChanges">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2"/>
          </svg>
          Actualizar Todos los Cambios ({{ pendingChangesCount }})
        </button>
        <button @click="resetAllChanges" class="reset-all-btn" :disabled="!hasPendingChanges">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" stroke-width="2"/>
            <path d="M3 3v5h5" stroke="currentColor" stroke-width="2"/>
          </svg>
          Descartar Todos los Cambios
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { API } from '../services/API.js'
import Auth from '../services/Auth.js'

const router = useRouter()
const products = ref([])
const filteredProducts = ref([])
const searchQuery = ref('')
const loading = ref(true)
const editedStocks = ref({})
const updating = ref({})

// Verificar permisos de administrador al cargar
onMounted(async () => {
  if (!Auth.isAuthenticated()) {
    router.push('/login')
    return
  }

  const user = Auth.getCurrentUser()
  if (!user || user.email !== 'admin@tienda.com') {
    // Solo el admin puede acceder
    router.push('/home')
    return
  }

  await loadProducts()
})

const loadProducts = async () => {
  try {
    loading.value = true
    const data = await API.Products.all()
    products.value = data
    filteredProducts.value = data
  } catch (error) {
    console.error('Error al cargar productos:', error)
    alert('Error al cargar productos')
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

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(amount)
}

const getStockClass = (stock) => {
  if (stock === 0) return 'out-of-stock'
  if (stock <= 5) return 'low-stock'
  return 'in-stock'
}

const hasChanges = (product) => {
  return editedStocks.value[product.id] !== undefined && 
         editedStocks.value[product.id] !== product.stock
}

const incrementStock = (productId) => {
  const product = products.value.find(p => p.id === productId)
  if (!product) return
  
  const currentValue = editedStocks.value[productId] ?? product.stock
  if (currentValue < 9999) {
    editedStocks.value[productId] = currentValue + 1
  }
}

const decrementStock = (productId) => {
  const product = products.value.find(p => p.id === productId)
  if (!product) return
  
  const currentValue = editedStocks.value[productId] ?? product.stock
  if (currentValue > 0) {
    editedStocks.value[productId] = currentValue - 1
  }
}

const resetStock = (productId) => {
  delete editedStocks.value[productId]
}

const updateStock = async (product) => {
  const newStock = editedStocks.value[product.id]
  if (newStock === undefined || newStock === product.stock) return

  try {
    updating.value[product.id] = true
    
    // Simulamos la actualización (en un caso real sería una API call)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Actualizar el producto local
    product.stock = newStock
    delete editedStocks.value[product.id]
    
    // Mostrar confirmación
    const notification = document.createElement('div')
    notification.className = 'notification success'
    notification.textContent = `Stock de "${product.name}" actualizado a ${newStock}`
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.remove()
    }, 3000)
    
  } catch (error) {
    console.error('Error al actualizar stock:', error)
    alert('Error al actualizar el stock')
  } finally {
    updating.value[product.id] = false
  }
}

const hasPendingChanges = computed(() => {
  return Object.keys(editedStocks.value).length > 0
})

const pendingChangesCount = computed(() => {
  return Object.keys(editedStocks.value).length
})

const bulkUpdateStock = async () => {
  if (!hasPendingChanges.value) return

  try {
    for (const productId of Object.keys(editedStocks.value)) {
      const product = products.value.find(p => p.id === parseInt(productId))
      if (product) {
        await updateStock(product)
      }
    }
  } catch (error) {
    console.error('Error en actualización masiva:', error)
  }
}

const resetAllChanges = () => {
  if (confirm('¿Estás seguro de que quieres descartar todos los cambios?')) {
    editedStocks.value = {}
  }
}
</script>

<style scoped>
.stock-management {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.header h1 {
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.header p {
  color: #718096;
  font-size: 1.1rem;
}

.loading-container {
  text-align: center;
  padding: 4rem 0;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.table-header {
  background: white;
  padding: 1.5rem;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-wrapper {
  position: relative;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #718096;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 25px;
  font-size: 1rem;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.table-container {
  background: white;
  border-radius: 0 0 12px 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.products-table-grid {
  width: 100%;
  border-collapse: collapse;
}

.products-table-grid th {
  background: #f7fafc;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #2d3748;
  border-bottom: 2px solid #e2e8f0;
}

.product-row {
  border-bottom: 1px solid #e2e8f0;
  transition: background-color 0.2s;
}

.product-row:hover {
  background-color: #f7fafc;
}

.product-row td {
  padding: 1rem;
  vertical-align: middle;
}

.image-cell {
  width: 80px;
}

.product-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.product-info h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
}

.product-info p {
  margin: 0;
  font-size: 0.875rem;
  color: #718096;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.price-cell {
  font-weight: 600;
  color: #2d3748;
}

.stock-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.stock-badge.in-stock {
  background: #c6f6d5;
  color: #22543d;
}

.stock-badge.low-stock {
  background: #fed7aa;
  color: #c2410c;
}

.stock-badge.out-of-stock {
  background: #fecaca;
  color: #991b1b;
}

.stock-input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stock-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: #667eea;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.stock-btn:hover:not(:disabled) {
  background: #5a67d8;
  transform: translateY(-1px);
}

.stock-btn:disabled {
  background: #e2e8f0;
  color: #a0aec0;
  cursor: not-allowed;
}

.stock-input {
  width: 80px;
  padding: 0.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  text-align: center;
  font-weight: 600;
}

.stock-input:focus {
  outline: none;
  border-color: #667eea;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.update-btn, .reset-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.update-btn {
  background: #48bb78;
  color: white;
}

.update-btn:hover:not(:disabled) {
  background: #38a169;
  transform: translateY(-1px);
}

.reset-btn {
  background: #ed8936;
  color: white;
}

.reset-btn:hover:not(:disabled) {
  background: #dd6b20;
  transform: translateY(-1px);
}

.update-btn:disabled, .reset-btn:disabled {
  background: #e2e8f0;
  color: #a0aec0;
  cursor: not-allowed;
  transform: none;
}

.update-btn svg, .reset-btn svg {
  width: 16px;
  height: 16px;
}

.loading-icon {
  animation: spin 1s linear infinite;
}

.global-actions {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.bulk-update-btn, .reset-all-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
}

.bulk-update-btn {
  background: #667eea;
  color: white;
}

.bulk-update-btn:hover:not(:disabled) {
  background: #5a67d8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.reset-all-btn {
  background: #e53e3e;
  color: white;
}

.reset-all-btn:hover:not(:disabled) {
  background: #c53030;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(229, 62, 62, 0.3);
}

.bulk-update-btn:disabled, .reset-all-btn:disabled {
  background: #e2e8f0;
  color: #a0aec0;
  cursor: not-allowed;
  transform: none;
}

.no-products {
  text-align: center;
  padding: 4rem 2rem;
  color: #718096;
}

.no-products-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem;
  color: #cbd5e0;
}

/* Notificaciones */
:global(.notification) {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

:global(.notification.success) {
  background: #48bb78;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .products-table-grid {
    font-size: 0.875rem;
  }
  
  .actions-cell {
    flex-direction: column;
  }
  
  .global-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>