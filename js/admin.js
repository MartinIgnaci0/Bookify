document.addEventListener('DOMContentLoaded', function() {
    
    // ---------------------------------------------------------
    // 1. SEGURIDAD Y SESIÓN
    // ---------------------------------------------------------
    const sesion = JSON.parse(localStorage.getItem('usuarioLogueado'));
    
    // Si no hay sesión, mandar al login
    if (!sesion) {
        window.location.href = 'login.html';
        return;
    }

    // Mostrar nombre del usuario en la barra superior
    const displayUser = document.getElementById('nombreUsuarioDisplay');
    if(displayUser) displayUser.textContent = sesion.nombre;

    // Si es Vendedor, ocultamos opciones de administración
    if (sesion.rol === 'vendedor') {
        // Ocultar botón Agregar
        const btnAdd = document.getElementById('btnAgregarProductoMain');
        if(btnAdd) btnAdd.style.display = 'none';

        // Ocultar menú Usuarios
        const menuUser = document.getElementById('menuUsuariosItem');
        if(menuUser) menuUser.style.display = 'none';
        
        // Ocultar columnas de acciones en tablas
        document.querySelectorAll('.columna-acciones').forEach(el => el.style.display = 'none');
    }

    // ---------------------------------------------------------
    // 2. NAVEGACIÓN (PESTAÑAS PRODUCTOS VS USUARIOS)
    // ---------------------------------------------------------
    const linkProd = document.getElementById('linkVerProductos');
    const linkUser = document.getElementById('linkVerUsuarios');
    const secProd = document.getElementById('seccionProductos');
    const secUser = document.getElementById('seccionUsuarios');

    if (linkProd && linkUser) {
        linkProd.addEventListener('click', (e) => {
            e.preventDefault(); // Evita salto de página
            secProd.classList.remove('d-none');
            secUser.classList.add('d-none');
        });

        linkUser.addEventListener('click', (e) => {
            e.preventDefault();
            secProd.classList.add('d-none');
            secUser.classList.remove('d-none');
            cargarUsuariosDesdeLocalStorage(); // Recargar lista
        });
    }

    // ---------------------------------------------------------
    // 3. LOGICA PRODUCTOS (TABLA)
    // ---------------------------------------------------------
    
    // A. Botones Eliminar (de los productos que ya están en el HTML)
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', function() {
            // Usamos confirm nativo por simplicidad y seguridad
            if(confirm("¿Estás seguro de eliminar este producto del catálogo?")) {
                const fila = this.closest('tr');
                fila.remove();
            }
        });
    });

    // B. Agregar Nuevo Libro (Desde el Modal)
    const btnGuardarLibro = document.getElementById('btnGuardarNuevoLibro');
    
    if (btnGuardarLibro) {
        btnGuardarLibro.addEventListener('click', function() {
            // 1. Obtener datos por ID (los que pusimos en el paso 1)
            const titulo = document.getElementById('prodTitulo').value;
            const autor = document.getElementById('prodAutor').value;
            const precio = document.getElementById('prodPrecio').value;
            const cat = document.getElementById('prodCat').value;
            
            // 2. Validaciones
            if (!titulo || !precio || !autor) {
                alert("Atención: Debes completar Título, Autor y Precio.");
                return;
            }

            if (parseFloat(precio) < 0) {
                alert("Error: El precio no puede ser negativo.");
                return;
            }

            // 3. Buscar la tabla de productos (tbody)
            // Tu HTML no tiene ID en el tbody de productos, así que lo buscamos así:
            const tbody = document.querySelector('#seccionProductos tbody');

            // 4. Crear la fila (TR)
            const tr = document.createElement('tr');

            // -- Imagen (Placeholder)
            const tdImg = document.createElement('td');
            tdImg.innerHTML = '<img src="img/p1.jpg" width="40" class="rounded" alt="cover">'; 
            tr.appendChild(tdImg);

            // -- Título
            const tdTitulo = document.createElement('td');
            tdTitulo.className = "fw-bold";
            tdTitulo.textContent = titulo;
            tr.appendChild(tdTitulo);

            // -- Autor
            const tdAutor = document.createElement('td');
            tdAutor.textContent = autor;
            tr.appendChild(tdAutor);

            // -- Precio
            const tdPrecio = document.createElement('td');
            tdPrecio.textContent = "$" + parseFloat(precio).toLocaleString('es-CL');
            tr.appendChild(tdPrecio);

            // -- Categoría (Badge)
            const tdCat = document.createElement('td');
            let colorBadge = "bg-secondary";
            if(cat === "Físico") colorBadge = "bg-warning text-dark";
            if(cat === "Digital") colorBadge = "bg-info text-dark";
            
            tdCat.innerHTML = `<span class="badge ${colorBadge}">${cat}</span>`;
            tr.appendChild(tdCat);

            // -- Acciones
            const tdAcciones = document.createElement('td');
            tdAcciones.className = "text-end columna-acciones";
            
            // Botón Editar (Visual)
            const btnEdit = document.createElement('button');
            btnEdit.className = "btn btn-sm btn-outline-primary me-1";
            btnEdit.innerHTML = '<i class="fa-solid fa-pen"></i>';
            
            // Botón Borrar (Funcional)
            const btnDel = document.createElement('button');
            btnDel.className = "btn btn-sm btn-outline-danger";
            btnDel.innerHTML = '<i class="fa-solid fa-trash"></i>';
            btnDel.addEventListener('click', function() {
                if(confirm("¿Eliminar este libro recién creado?")) {
                    tr.remove();
                }
            });

            tdAcciones.appendChild(btnEdit);
            tdAcciones.appendChild(btnDel);
            tr.appendChild(tdAcciones);

            // 5. Agregar a la tabla y limpiar form
            tbody.appendChild(tr);
            document.getElementById('formProducto').reset();
        });
    }

    // ---------------------------------------------------------
    // 4. LOGICA USUARIOS
    // ---------------------------------------------------------
    
    // Cargar usuarios al inicio
    cargarUsuariosDesdeLocalStorage();

    // ---------------------------------------------------------
    // 5. CERRAR SESIÓN
    // ---------------------------------------------------------
    const btnSalir = document.getElementById('btnCerrarSesion');
    if (btnSalir) {
        btnSalir.addEventListener('click', () => {
            if(confirm("¿Cerrar sesión?")) {
                localStorage.removeItem('usuarioLogueado');
                window.location.href = 'login.html';
            }
        });
    }
});

// FUNCIÓN: Cargar Usuarios (Limpia y Rellena la tabla)
function cargarUsuariosDesdeLocalStorage() {
    const tbody = document.getElementById('tablaUsuariosBody');
    if(!tbody) return;

    // Limpiar contenido actual
    while(tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    // Leer del LocalStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    if (usuarios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-3">No hay usuarios registrados en el sistema.</td></tr>';
        return;
    }

    // Crear filas
    usuarios.forEach((u, index) => {
        const tr = document.createElement('tr');

        // ID
        const tdId = document.createElement('td');
        tdId.textContent = index + 1;
        tr.appendChild(tdId);

        // Nombre
        const tdNombre = document.createElement('td');
        tdNombre.textContent = u.nombre;
        tr.appendChild(tdNombre);

        // Correo
        const tdEmail = document.createElement('td');
        tdEmail.textContent = u.email;
        tr.appendChild(tdEmail);

        // Rol
        const tdRol = document.createElement('td');
        tdRol.innerHTML = '<span class="badge bg-secondary">Cliente</span>';
        tr.appendChild(tdRol);

        // Estado
        const tdEstado = document.createElement('td');
        tdEstado.innerHTML = '<span class="text-success small fw-bold"><i class="fa-solid fa-circle me-1"></i>Activo</span>';
        tr.appendChild(tdEstado);

        // Acciones
        const tdAcciones = document.createElement('td');
        tdAcciones.className = "text-end";

        // -- Editar Usuario
        const btnEdit = document.createElement('button');
        btnEdit.className = "btn btn-sm btn-outline-primary me-2";
        btnEdit.innerHTML = '<i class="fa-solid fa-pen"></i>';
        btnEdit.title = "Editar Nombre";
        btnEdit.addEventListener('click', () => {
            let nuevoNombre = prompt("Editar nombre del usuario:", u.nombre);
            if (nuevoNombre && nuevoNombre.trim().length > 0) {
                // Actualizar visualmente
                tdNombre.textContent = nuevoNombre;
                // Actualizar en localStorage (Opcional, pero recomendado)
                u.nombre = nuevoNombre;
                localStorage.setItem('usuarios', JSON.stringify(usuarios));
            }
        });

        // -- Borrar Usuario
        const btnDel = document.createElement('button');
        btnDel.className = "btn btn-sm btn-outline-danger";
        btnDel.innerHTML = '<i class="fa-solid fa-trash"></i>';
        btnDel.title = "Eliminar Usuario";
        btnDel.addEventListener('click', () => {
            if(confirm(`¿Eliminar al usuario ${u.nombre}?`)) {
                // Eliminar visualmente
                tr.remove();
                // Eliminar del array y guardar en localStorage
                usuarios.splice(index, 1);
                localStorage.setItem('usuarios', JSON.stringify(usuarios));
                // Si quedó vacío, recargar para mostrar mensaje
                if(usuarios.length === 0) cargarUsuariosDesdeLocalStorage();
            }
        });

        tdAcciones.appendChild(btnEdit);
        tdAcciones.appendChild(btnDel);
        tr.appendChild(tdAcciones);

        tbody.appendChild(tr);
    });
}