<template>
  <div id="app">
    <Navbar 
      :cartItemsCount="cartItemsCount" 
      @toggle-cart="toggleCart" 
    />
    
    <router-view @add-to-cart="addToCart" />
    
    <CartDetail 
      :isVisible="showCart"
      :cartItems="cartItems"
      @close="toggleCart"
      @update-quantity="updateCartQuantity"
      @remove-item="removeFromCart"
      @clear-cart="clearCart"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Navbar from './components/Navbar.vue'
import CartDetail from './components/CartDetail.vue'

const cartItems = ref([])
const showCart = ref(false)

const cartItemsCount = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.quantity, 0)
})
const addToCart = (productData) => {
  const { product, quantity } = productData
  
  // Check if product already exists in cart
  const existingItem = cartItems.value.find(item => item.product.id === product.id)
  
  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity
    if (newQuantity <= product.stock) {
      existingItem.quantity = newQuantity
    } else {
      alert(`Solo quedan ${product.stock} unidades disponibles`)
      existingItem.quantity = product.stock
    }
  } else {
    cartItems.value.push({
      product,
      quantity
    })
  }
  
  console.log(`Agregado al carrito: ${quantity}x ${product.name}`)
}

const updateCartQuantity = ({ productId, quantity }) => {
  const item = cartItems.value.find(item => item.product.id === productId)
  if (item && quantity > 0 && quantity <= item.product.stock) {
    item.quantity = quantity
  }
}

const removeFromCart = (productId) => {
  const index = cartItems.value.findIndex(item => item.product.id === productId)
  if (index > -1) {
    cartItems.value.splice(index, 1)
  }
}

const clearCart = () => {
  cartItems.value = []
}

const toggleCart = () => {
  showCart.value = !showCart.value
}

onMounted(() => {
  const savedCart = localStorage.getItem('cart')
  if (savedCart) {
    try {
      cartItems.value = JSON.parse(savedCart)
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
    }
  }
})

// Save cart to localStorage whenever it changes
watch(cartItems, (newCart) => {
  localStorage.setItem('cart', JSON.stringify(newCart))
}, { deep: true })
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #ffffff;
}

#app {
  min-height: 100vh;
}

/* Utility Classes */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Scrollbar Styles */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}

/* Selection Styles */
::selection {
  background: rgba(102, 126, 234, 0.2);
  color: #1f2937;
}

/* Focus Styles */
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

/* Smooth Scrolling */
html {
  scroll-behavior: smooth;
}

/* Remove default input styles */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
