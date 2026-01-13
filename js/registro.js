document.addEventListener('DOMContentLoaded', function() {

  // --- REFERENCIAS ---
  const formulario = document.getElementById('registroForm');
  const mensajeAlerta = document.getElementById('mensajeAlerta');
  
  // Inputs
  const rutInput = document.getElementById('rut');
  const inputNombre = document.getElementById('nombre');
  const inputApellido = document.getElementById('apellido');
  const inputEmail = document.getElementById('email');
  const inputPass = document.getElementById('password');
  const inputConfirmPass = document.getElementById('confirmPassword');
  const inputDireccion = document.getElementById('direccion');
  
  // Selectores
  const regionSelect = document.getElementById('region');
  const comunaSelect = document.getElementById('comuna');

  // Regex para validar que no escriban solo espacios
  const patronNoVacio = /\S/; 

  // --- 1. CARGAR REGIONES Y COMUNAS ---
  regionesYComunas.forEach((region, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = region.nombre;
    regionSelect.appendChild(option);
  });

  regionSelect.addEventListener('change', function() {
    comunaSelect.length = 0; // Limpiar

    const defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.textContent = "Selecciona una comuna";
    defaultOption.selected = true;
    defaultOption.disabled = true;
    comunaSelect.appendChild(defaultOption);
    
    const regionIndex = this.value;
    if (regionIndex !== "") {
      const comunas = regionesYComunas[regionIndex].comunas;
      comunas.forEach(comuna => {
        const option = document.createElement('option');
        option.value = comuna;
        option.textContent = comuna;
        comunaSelect.appendChild(option);
      });
      comunaSelect.disabled = false;
    } else {
      comunaSelect.disabled = true;
    }
  });

  // --- 2. FORMATO RUT (Vuelve la magia) ---
  rutInput.addEventListener('input', function() {
    this.value = formatearRut(this.value);
  });

  // --- 3. EVENTO REGISTRARSE ---
  formulario.addEventListener('submit', function(event) {
    event.preventDefault(); 
    mensajeAlerta.textContent = ''; 

    // Limpiar errores previos
    const inputs = formulario.querySelectorAll('.form-control, .form-select');
    inputs.forEach(input => input.classList.remove('is-invalid'));

    let esValido = true;

    // --- VALIDACIONES ---

    // A. RUT (Validamos que no esté vacío y que el dígito verificador sea real)
    if (!patronNoVacio.test(rutInput.value) || !esRutValido(rutInput.value)) {
      rutInput.classList.add('is-invalid');
      esValido = false;
    }

    // B. Textos Simples
    if (!patronNoVacio.test(inputNombre.value)) {
      inputNombre.classList.add('is-invalid');
      esValido = false;
    }
    if (!patronNoVacio.test(inputApellido.value)) {
      inputApellido.classList.add('is-invalid');
      esValido = false;
    }
    if (!patronNoVacio.test(inputDireccion.value)) {
      inputDireccion.classList.add('is-invalid');
      esValido = false;
    }

    // C. Email (Usamos tu validación estándar del otro archivo)
    if (!patronNoVacio.test(inputEmail.value) || !esEmailValido(inputEmail.value)) {
      inputEmail.classList.add('is-invalid');
      esValido = false;
    }

    // D. Selectores
    if (regionSelect.value === "") {
      regionSelect.classList.add('is-invalid');
      esValido = false;
    }
    if (comunaSelect.value === "") {
      comunaSelect.classList.add('is-invalid');
      esValido = false;
    }

    // E. Contraseñas (Mínimo 6, como querías antes)
    if (inputPass.value.length < 6) {
      inputPass.classList.add('is-invalid');
      esValido = false;
    }

    if (inputConfirmPass.value !== inputPass.value) {
      inputConfirmPass.classList.add('is-invalid');
      esValido = false;
    }

    // --- 4. RESULTADO ---
    if (esValido) {
      // Guardar usuario (Mockup simple)
      const nuevoUsuario = {
        rut: rutInput.value,
        nombre: inputNombre.value,
        email: inputEmail.value,
        password: inputPass.value,
        region: regionSelect.options[regionSelect.selectedIndex].text,
        comuna: comunaSelect.value,
        rol: "cliente"
      };

      let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
      usuarios.push(nuevoUsuario);
      localStorage.setItem('usuarios', JSON.stringify(usuarios));

      // Éxito
      const divExito = document.createElement('div');
      divExito.className = 'alert alert-success';
      divExito.textContent = '¡Registro Exitoso! Redirigiendo...';
      mensajeAlerta.appendChild(divExito);

      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
    }
  });
});