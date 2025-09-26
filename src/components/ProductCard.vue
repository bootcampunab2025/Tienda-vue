<template>
  <div v-if="!product" class="product-card loading">
    <div class="loading-content">
      <div class="loading-spinner-card"></div>
      <p>Cargando producto...</p>
    </div>
  </div>
  <div v-else class="product-card">
    <div class="product-image-container">
      <img 
        :src="product.image" 
        :alt="product.name"
        class="product-image"
        @error="handleImageError"
      />
      <div class="product-badge" v-if="product.stock <= 5 && product.stock > 0">
        ¡Últimas {{ product.stock }}!
      </div>
      <div class="product-badge out-of-stock" v-if="product.stock === 0">
        Agotado
      </div>
    </div>

    <div class="product-content">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-description">{{ product.description }}</p>
      
      <div class="product-price">
        <span class="currency">$</span>
        <span class="amount">{{ formatPrice(product.price) }}</span>
      </div>

      <div class="product-stock">
        <svg class="stock-icon" viewBox="0 0 24 24" fill="none">
          <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" stroke="currentColor" stroke-width="2"/>
        </svg>
        <span class="stock-text">Stock: {{ product.stock }} unidades</span>
      </div>

      <div class="product-actions">
        <div class="quantity-selector">
          <button 
            @click="decreaseQuantity" 
            :disabled="quantity <= 1"
            class="quantity-btn"
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
          <input 
            v-model.number="quantity" 
            type="number" 
            min="1" 
            :max="product.stock"
            class="quantity-input"
            @input="validateQuantity"
          />
          <button 
            @click="increaseQuantity" 
            :disabled="quantity >= product.stock"
            class="quantity-btn"
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>

        <button 
          @click="addToCart" 
          :disabled="product.stock === 0 || isAdding"
          class="add-to-cart-btn"
          :class="{ 'adding': isAdding }"
        >
          <svg v-if="!isAdding" class="cart-icon" viewBox="0 0 24 24" fill="none">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4.01" stroke="currentColor" stroke-width="2"/>
          </svg>
          <div v-else class="loading-spinner-small"></div>
          {{ isAdding ? 'Agregando...' : 'Agregar al Carrito' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  emits: ['add-to-cart'],
  setup(props, { emit }) {
    const quantity = ref(1)
    const isAdding = ref(false)

    const formatPrice = (price) => {
      return new Intl.NumberFormat('es-CL', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(price)
    }

    const validateQuantity = () => {
      if (quantity.value < 1) quantity.value = 1
      if (quantity.value > props.product.stock) quantity.value = props.product.stock
    }

    const increaseQuantity = () => {
      if (quantity.value < props.product.stock) {
        quantity.value++
      }
    }

    const decreaseQuantity = () => {
      if (quantity.value > 1) {
        quantity.value--
      }
    }

    const addToCart = async () => {
      if (props.product.stock === 0) return
      
      isAdding.value = true
      
      // Simular delay para better UX
      setTimeout(() => {
        emit('add-to-cart', {
          product: props.product,
          quantity: quantity.value
        })
        
        quantity.value = 1
        isAdding.value = false
        showSuccessFeedback()
      }, 500)
    }

    const showSuccessFeedback = () => {
      console.log(`Agregado: ${quantity.value}x ${props.product.name}`)
    }

    const handleImageError = (event) => {
      event.target.src = `https://via.placeholder.com/300x200/667eea/ffffff?text=${encodeURIComponent(props.product.name)}`
    }

    return {
      quantity,
      isAdding,
      formatPrice,
      validateQuantity,
      increaseQuantity,
      decreaseQuantity,
      addToCart,
      handleImageError
    }
  }
}
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.product-image-container {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.product-badge.out-of-stock {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.product-content {
  padding: 1.5rem;
}

.product-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.product-description {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  display: flex;
  align-items: baseline;
  margin-bottom: 1rem;
}

.currency {
  font-size: 1.25rem;
  font-weight: 600;
  color: #667eea;
}

.amount {
  font-size: 2rem;
  font-weight: 800;
  color: #667eea;
  margin-left: 0.25rem;
}

.product-stock {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.stock-icon {
  width: 16px;
  height: 16px;
  margin-right: 0.5rem;
}

.product-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.quantity-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.quantity-btn {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quantity-btn:hover:not(:disabled) {
  background: #e5e7eb;
  border-color: #9ca3af;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-btn svg {
  width: 16px;
  height: 16px;
  color: #374151;
}

.quantity-input {
  width: 60px;
  height: 40px;
  text-align: center;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
}

.quantity-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.add-to-cart-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.add-to-cart-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.add-to-cart-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.add-to-cart-btn.adding {
  background: #10b981;
}

.cart-icon {
  width: 20px;
  height: 20px;
}

.loading-spinner-small {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.product-card.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: #f9fafb;
}

.loading-content {
  text-align: center;
  color: #6b7280;
}

.loading-spinner-card {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .product-content {
    padding: 1rem;
  }
  
  .product-name {
    font-size: 1.1rem;
  }
  
  .amount {
    font-size: 1.5rem;
  }
}
</style>