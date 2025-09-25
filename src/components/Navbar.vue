<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-logo">
        <router-link to="/home" class="logo-link">
          <svg class="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" stroke-width="2"/>
            <polyline points="7.5,4.21 12,6.81 16.5,4.21" stroke="currentColor" stroke-width="2"/>
            <polyline points="7.5,19.79 7.5,14.6 3,12" stroke="currentColor" stroke-width="2"/>
            <polyline points="21,12 16.5,14.6 16.5,19.79" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span class="logo-text">TechStore</span>
        </router-link>
      </div>

      <div class="nav-links">
        <router-link to="/home" class="nav-link">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none">
            <path d="M3 9L12 2L21 9V20a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" stroke-width="2"/>
          </svg>
          Inicio
        </router-link>
      </div>

      <div class="nav-actions">
        <button @click="toggleCart" class="cart-btn">
          <svg class="cart-icon" viewBox="0 0 24 24" fill="none">
            <path d="M3 3H5l2 13h11l4-8H7" stroke="currentColor" stroke-width="2"/>
            <circle cx="9" cy="21" r="1" stroke="currentColor" stroke-width="2"/>
            <circle cx="20" cy="21" r="1" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span class="cart-count" v-if="cartItemsCount > 0">{{ cartItemsCount }}</span>
          <span class="cart-text">Carrito</span>
        </button>

        <div class="user-menu">
          <router-link v-if="!isAuthenticated" to="/login" class="login-btn">
            <svg class="user-icon" viewBox="0 0 24 24" fill="none">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
            </svg>
            Login
          </router-link>

          <div v-else class="user-dropdown">
            <button @click="toggleUserMenu" class="user-btn">
              <svg class="user-icon" viewBox="0 0 24 24" fill="none">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
              </svg>
              {{ currentUser?.name || 'Usuario' }}
              <svg class="dropdown-arrow" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
            
            <div v-if="showUserMenu" class="dropdown-menu">
              <button @click="handleLogout" class="dropdown-item">
                <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="2"/>
                </svg>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Auth from '../services/Auth.js'

export default {
  name: 'Navbar',
  emits: ['toggle-cart'],
  props: {
    cartItemsCount: {
      type: Number,
      default: 0
    }
  },
  setup(props, { emit }) {
    const router = useRouter()
    const isAuthenticated = ref(false)
    const currentUser = ref(null)
    const showUserMenu = ref(false)

    const checkAuthStatus = () => {
      isAuthenticated.value = Auth.isAuthenticated()
      currentUser.value = Auth.getCurrentUser()
    }

    const toggleCart = () => {
      emit('toggle-cart')
    }

    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value
    }

    const handleLogout = async () => {
      try {
        await Auth.logout()
        localStorage.removeItem('user')
        isAuthenticated.value = false
        currentUser.value = null
        showUserMenu.value = false
        router.push('/home')
      } catch (error) {
        console.error('Error al cerrar sesión:', error)
      }
    }

    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-dropdown')) {
        showUserMenu.value = false
      }
    }

    onMounted(() => {
      checkAuthStatus()
      document.addEventListener('click', handleClickOutside)
      
      window.addEventListener('storage', checkAuthStatus)
      window.addEventListener('user-logged-in', checkAuthStatus)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
      window.removeEventListener('storage', checkAuthStatus)
      window.removeEventListener('user-logged-in', checkAuthStatus)
    })

    return {
      isAuthenticated,
      currentUser,
      showUserMenu,
      toggleCart,
      toggleUserMenu,
      handleLogout
    }
  }
}
</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

.nav-logo .logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  font-weight: 700;
  font-size: 1.5rem;
  transition: transform 0.2s ease;
}

.nav-logo .logo-link:hover {
  transform: scale(1.05);
}

.logo-icon {
  width: 32px;
  height: 32px;
  margin-right: 0.5rem;
  color: #fbbf24;
}

.logo-text {
  background: linear-gradient(45deg, #fbbf24, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transform: translateY(-1px);
}

.nav-icon {
  width: 18px;
  height: 18px;
  margin-right: 0.5rem;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cart-btn {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  font-weight: 500;
}

.cart-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.cart-icon {
  width: 20px;
  height: 20px;
  margin-right: 0.5rem;
}

.cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.login-btn {
  display: flex;
  align-items: center;
  text-decoration: none;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid #fbbf24;
  color: #fbbf24;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.login-btn:hover {
  background: #fbbf24;
  color: #1f2937;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
}

.user-dropdown {
  position: relative;
}

.user-btn {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.user-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.user-icon {
  width: 18px;
  height: 18px;
  margin-right: 0.5rem;
}

.dropdown-arrow {
  width: 16px;
  height: 16px;
  margin-left: 0.5rem;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  min-width: 180px;
  z-index: 50;
  margin-top: 0.5rem;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: #374151;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-weight: 500;
}

.dropdown-item:hover {
  background: #f3f4f6;
  color: #ef4444;
}

.dropdown-icon {
  width: 16px;
  height: 16px;
  margin-right: 0.5rem;
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0 0.5rem;
  }
  
  .nav-links {
    display: none;
  }
  
  .cart-text {
    display: none;
  }
  
  .logo-text {
    display: none;
  }
}
</style>