// datos
const regionesYComunas = [
  { nombre: "Metropolitana", comunas: ["Santiago", "Providencia", "Las Condes", "Maipú", "Puente Alto"] },
  { nombre: "Valparaíso", comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana"] },
  { nombre: "Biobío", comunas: ["Concepción", "Talcahuano", "Chiguayante", "San Pedro de la Paz"] },
  { nombre: "Araucanía", comunas: ["Temuco", "Padre Las Casas", "Villarrica", "Pucón"] }
];

// validaciones
function esEmailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function esRutValido(rut) {
  if (!rut || rut.length < 8) return false;
  
  let valor = rut.replace(/\./g, '').replace(/-/g, '');
  let cuerpo = valor.slice(0, -1);
  let dv = valor.slice(-1).toUpperCase();

  if (!/^\d+$/.test(cuerpo)) return false;

  let suma = 0, multiplo = 2;
  for (let i = 1; i <= cuerpo.length; i++) {
    suma += multiplo * valor.charAt(cuerpo.length - i);
    multiplo = (multiplo < 7) ? multiplo + 1 : 2;
  }

  let dvEsperado = 11 - (suma % 11);
  if (dvEsperado === 11) dvEsperado = '0';
  if (dvEsperado === 10) dvEsperado = 'K';

  return dvEsperado.toString() === dv;
}

function formatearRut(rut) {
  let value = rut.replace(/[^0-9kK]/g, "");
  if (value.length > 1) {
    value = value.substring(0, value.length - 1) + "-" + value.substring(value.length - 1);
  }
  return value;
}