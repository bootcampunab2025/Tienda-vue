<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
      <h2 class="text-2xl font-bold mb-6">¡Bienvenido!</h2>

      <p class="mb-4"> Estás autenticado.</p>

      <button
        @click="logout"
        class="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
      >
        Cerrar Sesión
      </button>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  name: "DashboardView",
  setup() {
    const router = useRouter();

    const logout = () => {
      localStorage.removeItem("token");
      router.push("/login");
    };

    return { logout };
  },
};
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
}
</style>
