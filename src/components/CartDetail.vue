<template>
  <div v-if="isVisible" class="cart-overlay" @click="closeCart">
    <div class="cart-modal" @click.stop>
      <div class="cart-header">
        <h2 class="cart-title">
          <svg class="cart-title-icon" viewBox="0 0 24 24" fill="none">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4.01" stroke="currentColor" stroke-width="2"/>
          </svg>
          Carrito de Compras
        </h2>
        <button @click="closeCart" class="close-btn">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
      </div>

      <div class="cart-content">
        <div v-if="cartItems.length === 0" class="empty-cart">
          <svg class="empty-cart-icon" viewBox="0 0 24 24" fill="none">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4.01" stroke="currentColor" stroke-width="2"/>
          </svg>
          <h3>Tu carrito está vacío</h3>
          <p>Agrega algunos productos para comenzar</p>
        </div>

        <div v-else class="cart-items">
          <div v-for="item in cartItems" :key="item.product.id" class="cart-item">
            <div class="item-image">
              <img :src="item.product.image" :alt="item.product.name" />
            </div>
            
            <div class="item-details">
              <h4 class="item-name">{{ item.product.name }}</h4>
              <p class="item-price">{{ formatCurrency(item.product.price) }}</p>
            </div>

            <div class="item-quantity">
              <button 
                @click="updateQuantity(item.product.id, item.quantity - 1)"
                :disabled="item.quantity <= 1"
                class="quantity-btn"
              >
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
              <span class="quantity-display">{{ item.quantity }}</span>
              <button 
                @click="updateQuantity(item.product.id, item.quantity + 1)"
                :disabled="item.quantity >= item.product.stock"
                class="quantity-btn"
              >
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
            </div>

            <div class="item-total">
              ${{ formatPrice(item.product.price * item.quantity) }}
            </div>

            <button @click="removeFromCart(item.product.id)" class="remove-btn">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div v-if="cartItems.length > 0" class="cart-footer">
        <div class="cart-summary">
          <div class="summary-row">
            <span>Subtotal ({{ totalItems }} items):</span>
            <span class="summary-amount">{{ formatCurrency(totalPrice) }}</span>
          </div>
          <div class="summary-row total-row">
            <span>Total:</span>
            <span class="total-amount">{{ formatCurrency(totalPrice) }}</span>
          </div>
        </div>

        <div class="cart-actions">
          <button @click="clearCart" class="clear-btn">
            <svg class="action-icon" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" stroke-width="2"/>
            </svg>
            Vaciar Carrito
          </button>
          <button @click="checkout" class="checkout-btn">
            <svg class="action-icon" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" stroke="currentColor" stroke-width="2"/>
            </svg>
            Proceder al Pago
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { formatCurrency } from '../utils/currency.js'

export default {
  name: 'CartDetail',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    cartItems: {
      type: Array,
      default: () => []
    }
  },
  emits: ['close', 'update-quantity', 'remove-item', 'clear-cart'],
  setup(props, { emit }) {
    const totalItems = computed(() => {
      return props.cartItems.reduce((total, item) => total + item.quantity, 0)
    })

    const totalPrice = computed(() => {
      return props.cartItems.reduce((total, item) => {
        return total + (item.product.price * item.quantity)
      }, 0)
    })

    const closeCart = () => {
      emit('close')
    }

    const updateQuantity = (productId, newQuantity) => {
      if (newQuantity < 1) return
      emit('update-quantity', { productId, quantity: newQuantity })
    }

    const removeFromCart = (productId) => {
      emit('remove-item', productId)
    }

    const clearCart = () => {
      if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        emit('clear-cart')
      }
    }

    const checkout = () => {
      alert(`¡Gracias por tu compra!\nTotal: ${formatCurrency(totalPrice.value)}\n\nEn una implementación real, esto redirectiría al proceso de pago.`)
      emit('clear-cart')
      emit('close')
    }

    return {
      formatCurrency,
      totalItems,
      totalPrice,
      closeCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      checkout
    }
  }
}
</script>

<style scoped>
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.cart-modal {
  background: white;
  border-radius: 20px;
  width: 90vw;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px 20px 0 0;
}

.cart-title {
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.cart-title-icon {
  width: 24px;
  height: 24px;
  margin-right: 0.5rem;
}

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.close-btn svg {
  width: 20px;
  height: 20px;
}

.cart-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.empty-cart {
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
}

.empty-cart-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  color: #d1d5db;
}

.empty-cart h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #374151;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 80px 1fr auto auto auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.cart-item:hover {
  background: #f3f4f6;
  transform: translateX(4px);
}

.item-image img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.item-details {
  min-width: 0;
}

.item-name {
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
}

.item-price {
  color: #667eea;
  font-weight: 600;
  margin: 0;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-btn {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quantity-btn:hover:not(:disabled) {
  border-color: #667eea;
  background: #f0f4ff;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-btn svg {
  width: 14px;
  height: 14px;
}

.quantity-display {
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}

.item-total {
  font-weight: 700;
  color: #1f2937;
  font-size: 1.1rem;
}

.remove-btn {
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #dc2626;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  background: #fecaca;
  border-color: #f87171;
}

.remove-btn svg {
  width: 16px;
  height: 16px;
}

.cart-footer {
  border-top: 1px solid #e5e7eb;
  padding: 1.5rem;
}

.cart-summary {
  margin-bottom: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.summary-row:last-child {
  margin-bottom: 0;
}

.total-row {
  border-top: 2px solid #e5e7eb;
  padding-top: 0.75rem;
  margin-top: 0.75rem;
  font-size: 1.125rem;
  font-weight: 700;
}

.summary-amount, .total-amount {
  font-weight: 600;
  color: #667eea;
}

.total-amount {
  font-size: 1.25rem;
  color: #1f2937;
}

.cart-actions {
  display: flex;
  gap: 1rem;
}

.clear-btn {
  flex: 1;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  color: #6b7280;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.clear-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.checkout-btn {
  flex: 2;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.checkout-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
}

.action-icon {
  width: 18px;
  height: 18px;
}

@media (max-width: 768px) {
  .cart-modal {
    width: 95vw;
    max-height: 90vh;
  }

  .cart-item {
    grid-template-columns: 60px 1fr auto;
    grid-template-areas: 
      "image details remove"
      "image quantity total";
    gap: 0.5rem;
  }

  .item-image {
    grid-area: image;
  }

  .item-details {
    grid-area: details;
  }

  .item-quantity {
    grid-area: quantity;
    justify-self: start;
  }

  .item-total {
    grid-area: total;
    justify-self: end;
  }

  .remove-btn {
    grid-area: remove;
    justify-self: end;
  }

  .cart-actions {
    flex-direction: column;
  }
}
</style>