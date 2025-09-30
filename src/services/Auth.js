import { ref } from "vue";
import { useRouter } from "vue-router";

export const token = ref(localStorage.getItem("token") || "");

const router = useRouter();
const BASE_URL = "http://localhost:3001";

const validUsers = [
  {
    email: "usuario1@mitienda.com",
    password: "password",
    name: "Usuario Demo",
  },
  {
    email: "admin@tienda.com", 
    password: "password",
    name: "Administrador",
    role: "admin"
  }
];

const validUser = validUsers[0]; // Para compatibilidad

export default class Auth {
  static async login({ email, password }) {
    try {
      // Primero intentar login con servidor
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        
        // Guardar token y datos de usuario
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("user", JSON.stringify({
          id: data.user?.id || null,
          name: data.user?.name || "",
          email: email,
          role: data.user?.role || "user"
        }));
        token.value = data.accessToken;

        return {
          id: data.user?.id || null,
          name: data.user?.name || "",
          email: email,
          token: data.accessToken,
          role: data.user?.role || "user"
        };
      }
    } catch (err) {
      console.log("Servidor no disponible, intentando login local...");
    }

    // Si el servidor falla, intentar con usuarios locales
    const localUser = validUsers.find(user => 
      user.email === email && user.password === password
    );

    if (localUser) {
      // Simular token para usuario local
      const mockToken = btoa(JSON.stringify({ 
        email: localUser.email, 
        exp: Math.floor(Date.now() / 1000) + 3600 // 1 hora
      }));
      
      // Guardar token y datos de usuario
      localStorage.setItem("token", mockToken);
      localStorage.setItem("user", JSON.stringify({
        id: localUser.email === "admin@tienda.com" ? 1 : 2,
        name: localUser.name,
        email: localUser.email,
        role: localUser.role || "user"
      }));
      token.value = mockToken;

      return {
        id: localUser.email === "admin@tienda.com" ? 1 : 2,
        name: localUser.name,
        email: localUser.email,
        token: mockToken,
        role: localUser.role || "user"
      };
    }

    throw new Error("Credenciales inválidas");
  }

  static async logout() {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem("token");
        token.value = "";
        resolve({ message: "Sesión cerrada exitosamente" });
      }, 300);
    });
  }

  static getCurrentUser() {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  }

  static isAuthenticated() {
    return !!localStorage.getItem("user");
  }
}

export const AuthService = {
  login(credentials) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = validUsers.find(u => 
          u.email === credentials.email && u.password === credentials.password
        );
        
        if (user) {
          resolve({ 
            name: user.name, 
            email: user.email,
            role: user.role || "user"
          });
        } else {
          reject(new Error("Credenciales inválidas"));
        }
      }, 1000);
    });
  },
};
