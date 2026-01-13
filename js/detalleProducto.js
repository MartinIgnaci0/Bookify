document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Obtener el ID del libro desde la URL
    const parametrosURL = new URLSearchParams(window.location.search);
    const idLibro = parseInt(parametrosURL.get('id'));

    // 2. Verificar si el libro existe
    if (isNaN(idLibro) || !libros[idLibro]) {
        window.location.href = 'catalogo.html';
        return;
    }

    // 3. Recuperar datos
    const libro = libros[idLibro];

    // 4. Rellenar HTML
    const img = document.getElementById('imgDetalle');
    const titulo = document.getElementById('tituloDetalle');
    const autor = document.getElementById('autorDetalle');
    const resena = document.getElementById('resenaDetalle');
    const precio = document.getElementById('precioDetalle');

    // Validamos que los elementos existan antes de asignar (evita errores)
    if(img) img.src = libro.imagen;
    if(titulo) titulo.textContent = libro.titulo;
    if(autor) autor.textContent = libro.autor;
    if(resena) resena.textContent = libro.reseña;
    if(precio) precio.textContent = `$${libro.precio.toLocaleString()}`;

    // 5. Configurar botón Agregar
    const btnAgregar = document.getElementById('btnAgregar');

    if(btnAgregar) {
        btnAgregar.addEventListener('click', () => {
            // A) Leemos el carrito actual
            let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

            // B) Buscamos si ya existe
            const indexEnCarrito = carrito.findIndex(item => item.titulo === libro.titulo);

            if (indexEnCarrito !== -1) {
                carrito[indexEnCarrito].cantidad += 1;
            } else {
                carrito.push({ ...libro, cantidad: 1 });
            }

            // C) ¡IMPORTANTE! Guardamos en localStorage
            localStorage.setItem("carrito", JSON.stringify(carrito));

            // D) Mostramos el Modal de Éxito
            const modalElemento = document.getElementById('modalExito');
            if (modalElemento) {
                const modalExito = new bootstrap.Modal(modalElemento);
                modalExito.show();
            } else {
                console.error("No se encontró el modal en el HTML");
                // Fallback por si acaso fallara el modal
                alert("Producto agregado (El modal falló, revisa el HTML)");
            }
        });
    }
});