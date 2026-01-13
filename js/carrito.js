document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('carrito-body');
  const totalSpan = document.getElementById('total');

  if (!tbody) return;

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  // si el carrito esta vacio
  if (carrito.length === 0) {
    const fila = document.createElement('tr');
    const celda = document.createElement('td');
    
    celda.textContent = "El carrito está vacío";
    celda.setAttribute('colspan', '6'); // Ocupacion de las 6 columnas
    celda.className = 'text-center py-4'; // Clases Bootstrap
    
    fila.appendChild(celda);
    tbody.appendChild(fila);
    
    if(totalSpan) totalSpan.textContent = '0';
    return;
  }

  let totalCalculado = 0;

  carrito.forEach((producto, index) => {
    // Calculo
    const subtotal = producto.precio * producto.cantidad;
    totalCalculado += subtotal;

    const fila = document.createElement('tr');

    // imagen
    const td1 = document.createElement('td');
    const div1 = document.createElement('div');
    div1.className = 'd-flex align-items-center';

    const img = document.createElement('img');
    img.src = producto.imagen;
    img.style.width = '50px';
    img.style.height = 'auto';
    img.className = 'me-3 rounded';

    const spanTitulo = document.createElement('span');
    spanTitulo.textContent = producto.titulo;

    div1.appendChild(img);
    div1.appendChild(spanTitulo);
    td1.appendChild(div1);
    fila.appendChild(td1);

    // autor
    const td2 = document.createElement('td');
    td2.textContent = producto.autor;
    fila.appendChild(td2);

    // precio
    const td3 = document.createElement('td');
    td3.textContent = `$${producto.precio.toLocaleString()}`;
    fila.appendChild(td3);

    // cantidad
    const td4 = document.createElement('td');
    const div4 = document.createElement('div');
    div4.className = 'd-flex align-items-center';

    // Botón Menos
    const btnMenos = document.createElement('button');
    btnMenos.textContent = '-';
    btnMenos.className = 'btn btn-sm btn-outline-secondary me-2';
    btnMenos.onclick = () => cambiarCantidad(index, -1); // Evento click

    // Numero Cantidad
    const spanCant = document.createElement('span');
    spanCant.textContent = producto.cantidad;

    // Botón Más
    const btnMas = document.createElement('button');
    btnMas.textContent = '+';
    btnMas.className = 'btn btn-sm btn-outline-secondary ms-2';
    btnMas.onclick = () => cambiarCantidad(index, 1); // Evento click

    div4.appendChild(btnMenos);
    div4.appendChild(spanCant);
    div4.appendChild(btnMas);
    td4.appendChild(div4);
    fila.appendChild(td4);

    // subtotal
    const td5 = document.createElement('td');
    td5.textContent = `$${subtotal.toLocaleString()}`;
    fila.appendChild(td5);

    // eliminar
    const td6 = document.createElement('td');
    const btnEliminar = document.createElement('button');
    btnEliminar.className = 'btn btn-danger btn-sm';
    btnEliminar.onclick = () => eliminarProducto(index); // Evento click

    const icono = document.createElement('i');
    icono.className = 'fa-solid fa-trash'; // Icono FontAwesome

    btnEliminar.appendChild(icono);
    td6.appendChild(btnEliminar);
    fila.appendChild(td6);

    tbody.appendChild(fila);
  });

  // Actualizar el total general
  if(totalSpan) totalSpan.textContent = totalCalculado.toLocaleString();
});

// FUNCIONES GLOBALES

function cambiarCantidad(index, cambio) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito[index].cantidad += cambio;
  
  if (carrito[index].cantidad <= 0) {
      carrito.splice(index, 1);
  }
  
  localStorage.setItem("carrito", JSON.stringify(carrito));
  location.reload(); 
}

function eliminarProducto(index) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  location.reload();
}