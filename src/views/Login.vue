<template>
  <div class="login-view">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo">
            <svg class="logo-icon" viewBox="0 0 24 24" fill="none">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span class="logo-text">TechStore</span>
          </div>
          <h1 class="login-title">Iniciar Sesión</h1>
          <p class="login-subtitle">Accede a tu cuenta para continuar</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email" class="form-label">
              <svg class="label-icon" viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2"/>
                <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2"/>
              </svg>
              Correo Electrónico
            </label>
            <input
              id="email"
              v-model="credentials.email"
              type="email"
              required
              class="form-input"
              :class="{ 'error': errors.email }"
              placeholder="usuario1@mitienda.com"
            />
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">
              <svg class="label-icon" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="16" r="1" stroke="currentColor" stroke-width="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="2"/>
              </svg>
              Contraseña
            </label>
            <div class="password-input-container">
              <input
                id="password"
                v-model="credentials.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="form-input"
                :class="{ 'error': errors.password }"
                placeholder="password"
              />
              <button
                type="button"
                @click="togglePassword"
                class="password-toggle"
              >
                <svg v-if="showPassword" viewBox="0 0 24 24" fill="none">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="2"/>
                  <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
            </div>
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>

          <div v-if="loginError" class="login-error">
            <svg class="error-icon" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/>
              <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/>
            </svg>
            {{ loginError }}
          </div>

          <div class="demo-credentials">
            <p class="demo-title">Credenciales de demostración:</p>
            <p class="demo-info">Email: <code>usuario1@mitienda.com</code></p>
            <p class="demo-info">Password: <code>password</code></p>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="login-button"
            :class="{ 'loading': isLoading }"
          >
            <div v-if="isLoading" class="loading-spinner"></div>
            <svg v-else class="login-icon" viewBox="0 0 24 24" fill="none">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" stroke="currentColor" stroke-width="2"/>
            </svg>
            {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </form>

        <div class="login-footer">
          <router-link to="/home" class="back-link">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2"/>
            </svg>
            Volver a la tienda
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import Auth from '../services/Auth.js'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const isLoading = ref(false)
    const showPassword = ref(false)
    const loginError = ref('')
    
    const credentials = reactive({
      email: '',
      password: ''
    })

    const errors = reactive({
      email: '',
      password: ''
    })

    const validateForm = () => {
      errors.email = ''
      errors.password = ''
      
      if (!credentials.email) {
        errors.email = 'El correo electrónico es requerido'
        return false
      }
      
      if (!credentials.email.includes('@')) {
        errors.email = 'Ingrese un correo electrónico válido'
        return false
      }
      
      if (!credentials.password) {
        errors.password = 'La contraseña es requerida'
        return false
      }
      
      if (credentials.password.length < 3) {
        errors.password = 'La contraseña debe tener al menos 3 caracteres'
        return false
      }
      
      return true
    }

    const handleLogin = async () => {
      if (!validateForm()) return

      isLoading.value = true
      loginError.value = ''

      try {
        const user = await Auth.login(credentials)
        
        localStorage.setItem('user', JSON.stringify(user))
        window.dispatchEvent(new CustomEvent('user-logged-in'))
        router.push('/home')
        
      } catch (error) {
        loginError.value = error.message
      } finally {
        isLoading.value = false
      }
    }

    const togglePassword = () => {
      showPassword.value = !showPassword.value
    }

    return {
      credentials,
      errors,
      isLoading,
      showPassword,
      loginError,
      handleLogin,
      togglePassword
    }
  }
}
</script>

<style scoped>
.login-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-container {
  width: 100%;
  max-width: 450px;
}

.login-card {
  background: white;
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.logo-icon {
  width: 40px;
  height: 40px;
  color: #667eea;
  margin-right: 0.5rem;
}

.logo-text {
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.login-subtitle {
  color: #6b7280;
  font-size: 1rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.label-icon {
  width: 16px;
  height: 16px;
  margin-right: 0.5rem;
  color: #667eea;
}

.form-input {
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #f9fafb;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input.error {
  border-color: #ef4444;
  background: #fef2f2;
}

.password-input-container {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  transition: color 0.2s ease;
}

.password-toggle:hover {
  color: #667eea;
}

.password-toggle svg {
  width: 20px;
  height: 20px;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.login-error {
  display: flex;
  align-items: center;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 1rem;
  border-radius: 12px;
  font-size: 0.875rem;
}

.error-icon {
  width: 20px;
  height: 20px;
  margin-right: 0.5rem;
  flex-shrink: 0;
}

.demo-credentials {
  background: #f0f9ff;
  border: 1px solid #e0f2fe;
  border-radius: 12px;
  padding: 1rem;
}

.demo-title {
  font-weight: 600;
  color: #0c4a6e;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.demo-info {
  color: #0369a1;
  font-size: 0.875rem;
  margin: 0.25rem 0;
}

.demo-info code {
  background: #bae6fd;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-weight: 600;
}

.login-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.login-button.loading {
  background: #10b981;
}

.login-icon {
  width: 20px;
  height: 20px;
}

.loading-spinner {
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

.login-footer {
  margin-top: 2rem;
  text-align: center;
}

.back-link {
  display: inline-flex;
  align-items: center;
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: #667eea;
}

.back-link svg {
  width: 16px;
  height: 16px;
  margin-right: 0.5rem;
}

@media (max-width: 768px) {
  .login-view {
    padding: 1rem;
  }

  .login-card {
    padding: 2rem;
  }

  .login-title {
    font-size: 1.75rem;
  }
}
</style>