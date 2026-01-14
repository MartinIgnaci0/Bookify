document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Obtener el ID del libro desde la URL
    const parametrosURL = new URLSearchParams(window.location.search);
    const idLibro = parseInt(parametrosURL.get('id'));

    // 2. Verificar si el libro existe en nuestro array 'libros' (de datos.js)
    if (isNaN(idLibro) || !libros[idLibro]) {
        window.location.href = 'catalogo.html';
        return;
    }

    // 3. Recuperar los datos del libro
    const libro = libros[idLibro];

    // 4. Seleccionar elementos del HTML
    const img = document.getElementById('imgDetalle');
    const titulo = document.getElementById('tituloDetalle');
    const autor = document.getElementById('autorDetalle');
    const resena = document.getElementById('resenaDetalle');
    const precio = document.getElementById('precioDetalle');
    
    // Nuevos elementos para Género y Stock
    const genero = document.getElementById('generoDetalle');
    const stock = document.getElementById('stockDetalle');

    // 5. Rellenar HTML con la información del libro
    if(img) img.src = libro.imagen;
    if(titulo) titulo.textContent = libro.titulo;
    if(autor) autor.textContent = libro.autor;
    if(resena) resena.textContent = libro.reseña;
    if(precio) precio.textContent = `$${libro.precio.toLocaleString('es-CL')}`;
    
    // Rellenar Género y Stock (si no existen en el objeto, ponemos valores por defecto)
    if(genero) genero.textContent = libro.genero || "General";
    if(stock) stock.textContent = (libro.stock || 0) + " unidades";

    // 6. Configurar botón Agregar y Validación de Stock
    const btnAgregar = document.getElementById('btnAgregar');

    if(btnAgregar) {
        // Si el stock es 0 o no está definido, bloqueamos el botón
        if (libro.stock <= 0 || !libro.stock) {
            btnAgregar.disabled = true;
            btnAgregar.innerHTML = '<i class="fa-solid fa-xmark"></i> Sin Stock';
            btnAgregar.classList.replace('btn-primary', 'btn-danger');
        } else {
            // Si hay stock, habilitamos el evento de clic
            btnAgregar.addEventListener('click', () => {
                // A) Leemos el carrito actual de LocalStorage
                let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

                // B) Buscamos si el libro ya está en el carrito para aumentar cantidad
                const indexEnCarrito = carrito.findIndex(item => item.titulo === libro.titulo);

                if (indexEnCarrito !== -1) {
                    carrito[indexEnCarrito].cantidad += 1;
                } else {
                    // Agregamos el libro con cantidad inicial 1
                    carrito.push({ ...libro, cantidad: 1 });
                }

                // C) Guardamos el carrito actualizado
                localStorage.setItem("carrito", JSON.stringify(carrito));

                // D) Mostrar el Modal de Éxito (Bootstrap)
                const modalElemento = document.getElementById('modalExito');
                if (modalElemento) {
                    const modalExito = new bootstrap.Modal(modalElemento);
                    modalExito.show();
                } else {
                    alert("¡Libro añadido al carrito!");
                }
            });
        }
    }
});