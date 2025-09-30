# 🛒 Tienda Vue - E-commerce Application

Una aplicación de e-commerce completa desarrollada con **Vue.js 3** que incluye gestión de productos, carrito de compras, autenticación de usuarios y panel de administración.

## 🚀 Características Principales

### 🏪 **Funcionalidades de la Tienda**
- ✅ **Catálogo de productos** con imágenes y descripciones
- ✅ **Búsqueda y filtrado** de productos por nombre
- ✅ **Carrito de compras** interactivo con popup y página dedicada
- ✅ **Control de stock** en tiempo real
- ✅ **Gestión de cantidades** con validación de stock disponible
- ✅ **Cálculo automático** de totales y subtotales
- ✅ **Formato de moneda** chilena (CLP)

### 🔐 **Sistema de Autenticación**
- ✅ **Login seguro** con validación de credenciales
- ✅ **Gestión de sesiones** con tokens JWT
- ✅ **Roles de usuario** (Usuario normal y Administrador)
- ✅ **Rutas protegidas** según permisos
- ✅ **Cierre de sesión** automático

### 🛡️ **Panel de Administración**
- ✅ **Gestión de inventario** (Solo administradores)
- ✅ **Actualización de stock** individual y masiva
- ✅ **Búsqueda de productos** en panel admin
- ✅ **Interfaz intuitiva** con controles visuales
- ✅ **Confirmaciones y notificaciones** de cambios

### 🎨 **Interfaz de Usuario**
- ✅ **Diseño responsivo** y moderno
- ✅ **Navegación intuitiva** con Vue Router
- ✅ **Componentes reutilizables** y modulares
- ✅ **Efectos visuales** y animaciones
- ✅ **Estados de carga** y feedback visual

## 🏗️ **Arquitectura del Proyecto**

### **📁 Estructura de Directorios**
```
src/
├── components/          # Componentes reutilizables
│   ├── CartDetail.vue   # Popup del carrito
│   ├── Navbar.vue      # Barra de navegación
│   ├── ProductCard.vue # Tarjeta de producto
│   └── Products.vue    # Lista de productos
├── views/              # Vistas/Páginas principales
│   ├── Cart.vue        # Página del carrito
│   ├── Dashboard.vue   # Panel de usuario
│   ├── Home.vue        # Página principal
│   ├── Login.vue       # Página de login
│   └── StockManagement.vue # Panel de administración
├── services/           # Servicios y APIs
│   ├── API.js         # Simulación de API REST
│   └── Auth.js        # Autenticación y autorización
└── router/            # Configuración de rutas
    └── index.js       # Router principal
```

### **� Tecnologías Utilizadas**
- **Vue.js 3** - Framework principal con Composition API
- **Vue Router** - Enrutamiento SPA
- **Vite** - Build tool y dev server
- **JSON Server** - API REST simulada
- **JWT Decode** - Manejo de tokens
- **CSS3** - Estilos modernos con gradientes y animaciones

## 👥 **Usuarios Demo**

### **👤 Usuario Normal**
```
Email: usuario1@mitienda.com
Password: password
Permisos: 
- Ver productos
- Agregar al carrito
- Realizar compras
- Ver perfil
```

### **🔑 Administrador**
```
Email: admin@tienda.com
Password: password
Permisos:
- Todas las funciones de usuario normal
- Acceso al panel de administración
- Gestión de inventario
- Actualización de stocks
```

## � **Instalación y Configuración**

### **1. Clonar el Repositorio**
```bash
git clone https://github.com/bootcampunab2025/Tienda-vue.git
cd Tienda-vue
```

### **2. Instalar Dependencias**
```bash
npm install
```

### **3. Iniciar Servidores**

**Servidor de Desarrollo (Frontend):**
```bash
npm run dev
```
- **URL**: http://localhost:5173 (o puerto alternativo si está ocupado)

**Servidor API (Backend Simulado):**
```bash
npm run server
```
- **URL**: http://localhost:3001

### **4. Acceder a la Aplicación**
- **Frontend**: http://localhost:5173
- **API Endpoints**: http://localhost:3001

## 🌐 **Rutas de la Aplicación**

| Ruta | Componente | Descripción | Acceso |
|------|------------|-------------|---------|
| `/` | Home.vue | Página principal con productos | Público |
| `/login` | Login.vue | Formulario de autenticación | Público |
| `/cart` | Cart.vue | Página del carrito de compras | Público |
| `/dashboard` | Dashboard.vue | Panel de usuario | Autenticado |
| `/admin/stocks` | StockManagement.vue | Gestión de inventario | Solo Admin |

## � **Guía de Uso**

### **Para Usuarios Normales:**
1. **Explorar productos** en la página principal
2. **Buscar productos** usando el buscador
3. **Agregar al carrito** seleccionando cantidad
4. **Ver carrito** haciendo clic en el botón del carrito
5. **Modificar cantidades** o eliminar productos
6. **Iniciar sesión** para acceder a funciones adicionales

### **Para Administradores:**
1. **Iniciar sesión** con credenciales de admin
2. **Acceder al panel** desde el menú de usuario
3. **Gestionar inventario** desde "Gestión de Stocks"
4. **Buscar productos** en el panel admin
5. **Actualizar stock** individual o masivamente
6. **Confirmar cambios** y recibir notificaciones

## 📊 **API Endpoints**

### **Productos**
- `GET /products` - Obtener todos los productos
- `GET /products/:id` - Obtener producto por ID

### **Autenticación**
- `POST /login` - Iniciar sesión
- `GET /users` - Obtener usuarios (desarrollo)

## 🔧 **Scripts Disponibles**

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run server       # API JSON Server

# Producción
npm run build        # Construir para producción
npm run preview      # Vista previa de la build
```

## 🛡️ **Seguridad**

### **Autenticación**
- Tokens JWT para sesiones
- Validación de credenciales
- Protección de rutas sensibles

### **Autorización**
- Verificación de roles de usuario
- Acceso restringido a funciones admin
- Redirecciones automáticas por permisos

## � **Características Responsive**

- ✅ **Mobile First** - Diseño optimizado para móviles
- ✅ **Tablet Friendly** - Adaptación para tablets
- ✅ **Desktop Enhanced** - Experiencia completa en desktop
- ✅ **Breakpoints CSS** - Responsive design fluido

## 🎯 **Funcionalidades Destacadas**

### **🛒 Carrito Inteligente**
- Contador dinámico en navbar
- Popup de vista rápida
- Página dedicada completa
- Persistencia de estado
- Validación de stock

### **🔍 Búsqueda Avanzada**
- Filtrado en tiempo real
- Búsqueda por nombre y descripción
- Resultados instantáneos
- Sin resultados - mensajes informativos

### **📦 Gestión de Stock**
- Indicadores visuales de stock
- Control de cantidad máxima
- Productos agotados claramente marcados
- Actualización en tiempo real

### **🎨 Experiencia Visual**
- Gradientes modernos
- Animaciones suaves
- Estados de carga
- Feedback visual inmediato
- Iconografía SVG personalizada

## 🚀 **Características Técnicas Avanzadas**

### **Vue.js 3 Features**
- Composition API
- Reactive refs y computed
- Provide/Inject pattern
- Component lifecycle hooks

### **State Management**
- Estado global del carrito
- Persistencia en localStorage
- Comunicación entre componentes
- Reactividad completa

### **Performance**
- Code splitting por rutas
- Lazy loading de componentes
- Optimización de imágenes
- Hot Module Replacement (HMR)

## 🏆 **Cumplimiento de Requerimientos**

### ✅ **Implementación Completa**
- [x] Proyecto Vue.js generado
- [x] Lista y filtrado de productos
- [x] Carrito de compras funcional
- [x] Sistema de autenticación
- [x] Control de stocks
- [x] Rutas protegidas
- [x] Componentes modulares
- [x] Servicios API simulados
- [x] **EXTRA**: Panel de administración

## 👨‍💻 **Desarrollo**

### **Estructura de Componentes**
```vue
<!-- Ejemplo de componente -->
<template>
  <!-- UI Template -->
</template>

<script setup>
// Composition API
</script>

<style scoped>
/* Estilos locales */
</style>
```

### **Patrones Utilizados**
- **Single File Components** (SFC)
- **Composition API** pattern
- **Provide/Inject** para estado global
- **Props/Emits** para comunicación
- **Router Guards** para protección

## 📈 **Escalabilidad**

El proyecto está diseñado para ser fácilmente escalable:

- **Componentes modulares** reutilizables
- **Servicios abstraidos** para cambiar backend
- **Routing estructurado** para nuevas funcionalidades
- **Estado manejable** para características adicionales

## 🤝 **Contribución**

Este proyecto es parte del **Bootcamp UNAB 2025** - Módulo de Desarrollo de Interfaces Interactivas con Vue.js.

**Fecha**: Septiembre 2025

---

## 📞 **Soporte**

Para dudas o problemas:
1. Verificar que ambos servidores estén corriendo
2. Comprobar las credenciales de usuario
3. Revisar la consola del navegador para errores
4. Confirmar que los puertos 3001 y 5173 estén disponibles

**🌟 ¡Disfruta explorando la aplicación Tienda Vue!** 🌟
