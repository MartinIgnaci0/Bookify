document.addEventListener('DOMContentLoaded', function() {

  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('emailLogin');
  const passwordInput = document.getElementById('passwordLogin');
  const mensajeAlerta = document.getElementById('mensajeAlerta');

  loginForm.addEventListener('submit', function(event) {
    event.preventDefault(); 
    
    // Limpieza visual
    mensajeAlerta.textContent = '';
    mensajeAlerta.className = ''; 
    emailInput.classList.remove('is-invalid');
    passwordInput.classList.remove('is-invalid');

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Si están vacíos, mostrar rojo y salir
    if (!email || !password) {
      if (!email) emailInput.classList.add('dis-invali');
      if (!password) passwordInput.classList.add('is-invalid');
      return; 
    }

    // Admin
    if (email === "admin@bookify.com" && password === "admin123") {
        const sesionAdmin = {
            nombre: "Admin",
            email: "admin@bookify.com",
            rol: "admin"
        };
        
        localStorage.setItem('usuarioLogueado', JSON.stringify(sesionAdmin));

        mensajeAlerta.className = 'mb-3 text-center text-primary fw-bold';
        mensajeAlerta.textContent = "¡Bienvenido Admin! Entrando...";
        
        setTimeout(() => { window.location.href = "admin.html"; }, 1500);
        return;
    }
    // vendedor
    if (email === "vendedor@bookify.com" && password === "vendedor") {
        const sesionAdmin = {
            nombre: "Vendedor",
            email: "vendedor@bookify.com",
            rol: "vendedor"
        };
        
        localStorage.setItem('usuarioLogueado', JSON.stringify(sesionAdmin));

        mensajeAlerta.className = 'mb-3 text-center text-primary fw-bold';
        mensajeAlerta.textContent = "¡Bienvenido Vendedor! Entrando...";
        
        setTimeout(() => { window.location.href = "admin.html"; }, 1500);
        return;
    }

    // buscar si existe usuario
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    // si existe contraseña y correo
    const usuarioEncontrado = usuarios.find(user => user.email === email && user.password === password);

    if (usuarioEncontrado) {
      // existe
      localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioEncontrado));
      
      mensajeAlerta.className = 'mb-3 text-center text-success fw-bold';
      mensajeAlerta.textContent = `¡Bienvenido, ${usuarioEncontrado.nombre}!`;
      
      setTimeout(() => { window.location.href = "index.html"; }, 1500);

    } else {
      // No existe o error de contraseña
      mensajeAlerta.className = 'mb-3 text-center text-danger fw-bold';
      mensajeAlerta.textContent = "Correo o contraseña incorrectos.";
    }
  });
});