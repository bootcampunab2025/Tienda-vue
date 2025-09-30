<template>
  <div class="cart-page">
    <div class="cart-container">
      <div class="cart-header">
        <h1 class="cart-title">
          <svg class="cart-icon" viewBox="0 0 24 24" fill="none">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4.01" stroke="currentColor" stroke-width="2"/>
          </svg>
          Mi Carrito de Compras
        </h1>
        <p class="cart-subtitle">Revisa y gestiona tus productos seleccionados</p>
      </div>

      <!-- Carrito vacío -->
      <div v-if="cartItems.length === 0" class="empty-cart">
        <div class="empty-cart-content">
          <svg class="empty-cart-icon" viewBox="0 0 24 24" fill="none">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4.01" stroke="currentColor" stroke-width="2"/>
          </svg>
          <h2>Tu carrito está vacío</h2>
          <p>¡Explora nuestros productos y encuentra algo increíble!</p>
          <router-link to="/" class="continue-shopping-btn">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" stroke-width="2"/>
            </svg>
            Continuar Comprando
          </router-link>
        </div>
      </div>

      <!-- Carrito con productos -->
      <div v-else class="cart-content">
        <div class="cart-items-section">
          <div class="cart-items-header">
            <h2>Productos en tu carrito ({{ totalItems }} items)</h2>
            <button @click="clearAllItems" class="clear-all-btn">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" stroke-width="2"/>
              </svg>
              Vaciar Carrito
            </button>
          </div>

          <div class="cart-items-list">
            <div v-for="item in cartItems" :key="item.product.id" class="cart-item">
              <div class="item-image">
                <img :src="item.product.image" :alt="item.product.name" @error="handleImageError" />
              </div>
              
              <div class="item-details">
                <h3 class="item-name">{{ item.product.name }}</h3>
                <p class="item-description">{{ item.product.description }}</p>
                <div class="item-stock">
                  <span class="stock-badge" :class="{ 'low-stock': item.product.stock <= 5 }">
                    Stock: {{ item.product.stock }} unidades
                  </span>
                </div>
              </div>

              <div class="item-price">
                <span class="unit-price">{{ formatCurrency(item.product.price) }}</span>
                <span class="price-label">por unidad</span>
              </div>

              <div class="item-quantity">
                <label class="quantity-label">Cantidad:</label>
                <div class="quantity-controls">
                  <button 
                    @click="decreaseQuantity(item.product.id)"
                    :disabled="item.quantity <= 1"
                    class="quantity-btn"
                  >
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </button>
                  <input 
                    v-model.number="item.quantity" 
                    type="number" 
                    min="1" 
                    :max="item.product.stock"
                    class="quantity-input"
                    @change="validateQuantity(item)"
                  />
                  <button 
                    @click="increaseQuantity(item.product.id)"
                    :disabled="item.quantity >= item.product.stock"
                    class="quantity-btn"
                  >
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="item-total">
                <span class="total-price">{{ formatCurrency(item.product.price * item.quantity) }}</span>
                <span class="total-label">Subtotal</span>
              </div>

              <div class="item-actions">
                <button @click="removeItem(item.product.id)" class="remove-btn">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Resumen del carrito -->
        <div class="cart-summary">
          <div class="summary-card">
            <h3 class="summary-title">Resumen de la Compra</h3>
            
            <div class="summary-details">
              <div class="summary-row">
                <span>Productos ({{ totalItems }} items):</span>
                <span>{{ formatCurrency(subtotal) }}</span>
              </div>
              <div class="summary-row">
                <span>Envío:</span>
                <span class="free-shipping">Gratis</span>
              </div>
              <div class="summary-row discount-row" v-if="discount > 0">
                <span>Descuento:</span>
                <span class="discount-amount">-{{ formatCurrency(discount) }}</span>
              </div>
              <hr class="summary-divider">
              <div class="summary-row total-row">
                <span class="total-label">Total:</span>
                <span class="total-amount">{{ formatCurrency(total) }}</span>
              </div>
            </div>

            <div class="promo-code-section">
              <div class="promo-input-group">
                <input 
                  v-model="promoCode" 
                  type="text" 
                  placeholder="Código de descuento"
                  class="promo-input"
                  @keyup.enter="applyPromoCode"
                />
                <button @click="applyPromoCode" class="apply-promo-btn">
                  Aplicar
                </button>
              </div>
              <p v-if="promoMessage" class="promo-message" :class="{ 'success': promoSuccess, 'error': !promoSuccess }">
                {{ promoMessage }}
              </p>
            </div>

            <div class="checkout-actions">
              <button @click="proceedToCheckout" class="checkout-btn">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" stroke="currentColor" stroke-width="2"/>
                </svg>
                Proceder al Pago
              </button>
              <router-link to="/" class="continue-shopping-link">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M10 19l-7-7m0 0l7-7m-7 7h18" stroke="currentColor" stroke-width="2"/>
                </svg>
                Continuar Comprando
              </router-link>
            </div>

            <div class="security-badges">
              <div class="security-item">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>Compra Segura</span>
              </div>
              <div class="security-item">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>Pagos Protegidos</span>
              </div>
              <div class="security-item">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16l-3-9m3 9l3-9" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>Envío Gratis</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, inject } from 'vue'
import { formatCurrency } from '../utils/currency.js'

export default {
  name: 'CartPage',
  setup() {
    const cartItems = inject('cartItems', ref([]))
    const promoCode = ref('')
    const promoMessage = ref('')
    const promoSuccess = ref(false)
    const appliedDiscount = ref(0)

    const totalItems = computed(() => {
      return cartItems.value.reduce((total, item) => total + item.quantity, 0)
    })

    const subtotal = computed(() => {
      return cartItems.value.reduce((total, item) => total + (item.product.price * item.quantity), 0)
    })

    const discount = computed(() => appliedDiscount.value)

    const total = computed(() => subtotal.value - discount.value)

    const increaseQuantity = (productId) => {
      const item = cartItems.value.find(item => item.product.id === productId)
      if (item && item.quantity < item.product.stock) {
        item.quantity++
      }
    }

    const decreaseQuantity = (productId) => {
      const item = cartItems.value.find(item => item.product.id === productId)
      if (item && item.quantity > 1) {
        item.quantity--
      }
    }

    const validateQuantity = (item) => {
      if (item.quantity < 1) item.quantity = 1
      if (item.quantity > item.product.stock) {
        item.quantity = item.product.stock
        alert(`Solo hay ${item.product.stock} unidades disponibles`)
      }
    }

    const removeItem = (productId) => {
      const index = cartItems.value.findIndex(item => item.product.id === productId)
      if (index > -1) {
        cartItems.value.splice(index, 1)
      }
    }

    const clearAllItems = () => {
      if (confirm('¿Estás seguro de que quieres vaciar todo el carrito?')) {
        cartItems.value.splice(0)
        appliedDiscount.value = 0
        promoCode.value = ''
        promoMessage.value = ''
      }
    }

    const applyPromoCode = () => {
      const code = promoCode.value.toUpperCase().trim()
      
      if (!code) {
        promoMessage.value = 'Por favor ingresa un código de descuento'
        promoSuccess.value = false
        return
      }

      // Códigos de descuento simulados
      const promoCodes = {
        'DESCUENTO10': { discount: 0.10, message: '¡10% de descuento aplicado!' },
        'BIENVENIDO': { discount: 0.05, message: '¡5% de descuento de bienvenida!' },
        'TECH2025': { discount: 0.15, message: '¡15% de descuento especial!' },
        'ENVIOGRATIS': { discount: 0, message: 'Envío gratis ya incluido' }
      }

      if (promoCodes[code]) {
        const promo = promoCodes[code]
        appliedDiscount.value = subtotal.value * promo.discount
        promoMessage.value = promo.message
        promoSuccess.value = true
      } else {
        promoMessage.value = 'Código de descuento no válido'
        promoSuccess.value = false
        appliedDiscount.value = 0
      }
    }

    const proceedToCheckout = () => {
      // Aquí iría la lógica real del checkout
      alert(`Procesando compra por ${formatCurrency(total.value)}\n\nEsta es una demostración. En una aplicación real, esto redirigiría al sistema de pagos.`)
    }

    const handleImageError = (event) => {
      event.target.src = `https://via.placeholder.com/150x150/667eea/ffffff?text=Imagen`
    }

    return {
      cartItems,
      totalItems,
      subtotal,
      discount,
      total,
      promoCode,
      promoMessage,
      promoSuccess,
      increaseQuantity,
      decreaseQuantity,
      validateQuantity,
      removeItem,
      clearAllItems,
      applyPromoCode,
      proceedToCheckout,
      handleImageError,
      formatCurrency
    }
  }
}
</script>

<style scoped>
.cart-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem 0;
}

.cart-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.cart-header {
  text-align: center;
  margin-bottom: 3rem;
}

.cart-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.cart-icon {
  width: 48px;
  height: 48px;
  color: #667eea;
}

.cart-subtitle {
  font-size: 1.1rem;
  color: #6b7280;
}

/* Carrito vacío */
.empty-cart {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.empty-cart-content {
  text-align: center;
  max-width: 400px;
}

.empty-cart-icon {
  width: 80px;
  height: 80px;
  color: #d1d5db;
  margin-bottom: 1.5rem;
}

.empty-cart-content h2 {
  font-size: 1.8rem;
  color: #374151;
  margin-bottom: 1rem;
}

.empty-cart-content p {
  color: #6b7280;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.continue-shopping-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.continue-shopping-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.continue-shopping-btn svg {
  width: 20px;
  height: 20px;
}

/* Carrito con contenido */
.cart-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  align-items: start;
}

.cart-items-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.cart-items-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f3f4f6;
}

.cart-items-header h2 {
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 600;
}

.clear-all-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-all-btn:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

.clear-all-btn svg {
  width: 18px;
  height: 18px;
}

/* Items del carrito */
.cart-items-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr auto auto auto auto;
  gap: 1.5rem;
  align-items: center;
  padding: 1.5rem;
  border: 2px solid #f3f4f6;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.cart-item:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.item-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  min-width: 0;
}

.item-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.item-description {
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.stock-badge {
  display: inline-flex;
  align-items: center;
  background: #10b981;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.stock-badge.low-stock {
  background: #f59e0b;
}

.item-price {
  text-align: center;
}

.unit-price {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
}

.price-label {
  font-size: 0.8rem;
  color: #6b7280;
}

.item-quantity {
  text-align: center;
}

.quantity-label {
  display: block;
  font-size: 0.9rem;
  color: #374151;
  margin-bottom: 0.5rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quantity-btn:hover:not(:disabled) {
  border-color: #667eea;
  background: #f8faff;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-btn svg {
  width: 16px;
  height: 16px;
}

.quantity-input {
  width: 60px;
  height: 32px;
  text-align: center;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-weight: 500;
}

.item-total {
  text-align: center;
}

.total-price {
  display: block;
  font-size: 1.2rem;
  font-weight: 700;
  color: #667eea;
}

.total-label {
  font-size: 0.8rem;
  color: #6b7280;
}

.item-actions {
  text-align: center;
}

.remove-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f87171;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.remove-btn:hover {
  background: #ef4444;
  transform: translateY(-1px);
}

.remove-btn svg {
  width: 16px;
  height: 16px;
}

/* Resumen del carrito */
.cart-summary {
  position: sticky;
  top: 2rem;
}

.summary-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.summary-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.summary-details {
  margin-bottom: 2rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.summary-row span:first-child {
  color: #6b7280;
}

.summary-row span:last-child {
  font-weight: 500;
  color: #1f2937;
}

.free-shipping {
  color: #10b981 !important;
  font-weight: 600;
}

.discount-row span:last-child {
  color: #ef4444 !important;
}

.summary-divider {
  border: none;
  height: 2px;
  background: #f3f4f6;
  margin: 1.5rem 0;
}

.total-row {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0;
}

.total-row .total-label {
  color: #1f2937 !important;
  font-size: 1.2rem;
}

.total-row .total-amount {
  color: #667eea !important;
  font-size: 1.3rem;
  font-weight: 700;
}

/* Código promocional */
.promo-code-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8faff;
  border-radius: 12px;
  border: 2px dashed #c7d2fe;
}

.promo-input-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.promo-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9rem;
}

.promo-input:focus {
  outline: none;
  border-color: #667eea;
}

.apply-promo-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.apply-promo-btn:hover {
  background: #5a67d8;
}

.promo-message {
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.promo-message.success {
  color: #10b981;
}

.promo-message.error {
  color: #ef4444;
}

/* Acciones de checkout */
.checkout-actions {
  margin-bottom: 2rem;
}

.checkout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.checkout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.checkout-btn svg {
  width: 20px;
  height: 20px;
}

.continue-shopping-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.continue-shopping-link:hover {
  color: #5a67d8;
}

.continue-shopping-link svg {
  width: 18px;
  height: 18px;
}

/* Badges de seguridad */
.security-badges {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.security-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #6b7280;
  font-size: 0.9rem;
}

.security-item svg {
  width: 20px;
  height: 20px;
  color: #10b981;
}

/* Responsive */
@media (max-width: 968px) {
  .cart-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .cart-summary {
    position: static;
  }
}

@media (max-width: 768px) {
  .cart-page {
    padding: 1rem 0;
  }
  
  .cart-title {
    font-size: 2rem;
  }
  
  .cart-item {
    grid-template-columns: 80px 1fr;
    gap: 1rem;
  }
  
  .item-price,
  .item-quantity,
  .item-total,
  .item-actions {
    grid-column: 1 / -1;
    text-align: left;
    padding-top: 1rem;
    border-top: 1px solid #f3f4f6;
  }
  
  .item-quantity .quantity-controls,
  .item-actions {
    justify-content: flex-start;
  }
  
  .cart-items-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .promo-input-group {
    flex-direction: column;
  }
}
</style>