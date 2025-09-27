import { ref } from "vue";
import { useRouter } from "vue-router";

// Ref reactivo para token global
export const token = ref(localStorage.getItem("token") || "");

const router = useRouter();
const BASE_URL = "http://localhost:3001"; // URL de tu JSON Server

export default class Auth {
  // Login usando únicamente el backend
  static async login({ email, password }) {
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.message || "Error de login");
      }

      const data = await res.json();
      console.log("Respuesta login backend:", data);

      // Guardar token en localStorage y ref reactivo
      localStorage.setItem("token", data.accessToken);
      token.value = data.accessToken;

      return {
        id: data.user?.id || null,
        name: data.user?.name || "",
        email: email,
        token: data.accessToken,
      };
    } catch (err) {
      console.error("Error login:", err);
      throw err;
    }
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
