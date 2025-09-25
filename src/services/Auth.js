class Auth {
  static validCredentials = {
    email: 'usuario1@mitienda.com',
    password: 'password'
  };

  static login(credentials) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const { email, password } = credentials;
        
        if (email === this.validCredentials.email && password === this.validCredentials.password) {
          const user = {
            id: 1,
            name: 'Usuario Demo',
            email: email,
            token: 'jwt-token-simulado-' + Date.now()
          };
          resolve(user);
        } else {
          reject(new Error('Credenciales inválidas. Use: usuario1@mitienda.com / password'));
        }
      }, 800);
    });
  }

  static logout() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: 'Sesión cerrada exitosamente' });
      }, 300);
    });
  }

  static getCurrentUser() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  static isAuthenticated() {
    return localStorage.getItem('user') !== null;
  }
}

export default Auth;