document.addEventListener('DOMContentLoaded', () => {

  // --- 1. LÓGICA DE FILTROS ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const bookCards = document.querySelectorAll('.book-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      bookCards.forEach(card => {
        if(filter === 'all') {
          card.style.display = 'block';
        } else {
          card.style.display = card.classList.contains(filter) ? 'block' : 'none';
        }
      });
    });
  });

  // --- detalleProducto ---
  const detalleBtns = document.querySelectorAll('.ver-detalle-btn');

  detalleBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      window.location.href = `detalleProducto.html?id=${index}`;
    });
  });

});