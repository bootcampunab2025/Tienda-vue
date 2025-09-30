import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Dashboard from "../views/Dashboard.vue";
import Cart from '../views/Cart.vue';
import StockManagement from '../views/StockManagement.vue';
import jwtDecode from 'jwt-decode';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/home',
    redirect: '/'
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/stocks',
    name: 'StockManagement',
    component: StockManagement,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  console.log('🚦 Router Guard - Navegando a:', to.path)
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  console.log('🔑 Token presente:', !!token)
  console.log('👤 Usuario:', user)

  if (to.meta.requiresAuth) {
    console.log('🔐 Ruta requiere autenticación')
    
    if (!token || !user.email) {
      console.log('❌ Sin token o usuario, redirigiendo a login')
      return next("/login");
    }    

    // Verificar si la ruta requiere permisos de administrador
    if (to.meta.requiresAdmin) {
      console.log('👑 Ruta requiere permisos de admin')
      console.log('� Email del usuario:', user.email)
      
      if (user.email !== "admin@tienda.com") {
        console.log('❌ Usuario no es admin, redirigiendo a home')
        return next("/home");
      }
      console.log('✅ Usuario autorizado como admin')
    }
  }
  
  console.log('✅ Navegación autorizada')
  next();
});

export default router;
