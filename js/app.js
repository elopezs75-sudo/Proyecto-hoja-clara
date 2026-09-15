//nivel 1 
const numero_filas = 20;
const numero_columnas = 15;
//parte Nivel 2 variable 
const datosHojas = {};
function numerocolumna(numeroColumna) {
  let letra = "";
  let n = numeroColumna;
  while (n >= 0) {
    letra = String.fromCharCode(65 + (n % 26)) + letra;
    n = Math.floor(n / 26) - 1;
  }
  return letra;
}
// Nivel 1: Genera la cuadrícula
function cuadricula() {
  const contenedor = document.getElementById("Hoja calculo");

  const tabla = document.createElement("table");
  tabla.id = "Hojacalculo";

  //Nivel 1:encabezado
  const encabezado = document.createElement("tr");
  //Nivel 1 : esquina
  const esquina = document.createElement("th");
  encabezado.appendChild(esquina);

  for (let col = 0; col < numero_columnas; col++) {
    const th = document.createElement("th");
    th.textContent = numerocolumna(col);
    encabezado.appendChild(th);
  }
  tabla.appendChild(encabezado);

  //NIvel 1: filas de los datos
  for (let fila = 1; fila <= numero_filas; fila++) {
    const tr = document.createElement("tr");


const thFila = document.createElement("th");
thFila.textContent = fila;
tr.appendChild(thFila);

for (let col = 0; col < numero_columnas; col++) {
const td = document.createElement("td");

const idCelda = numerocolumna(col) + fila;
td.id = "celda-" + idCelda;
td.dataset.celda = idCelda;


//nivel 2 ingresar datos a las celdas
td.addEventListener("dblclick", function () {
activarEdicion(td, idCelda);
});
tr.appendChild(td);
}

tabla.appendChild(tr);
}
contenedor.appendChild(tabla);
}

document.addEventListener("DOMContentLoaded", cuadricula);
//NIVEL 2 ACTIVAR CELDAS
function activarEdicion(td, idCelda) {
if (td.querySelector("input")) return;

const valorActual = datosHojas[idCelda] || "";


td.textContent = "";
const input = document.createElement("input");
input.type = "text";
input.value = valorActual;
td.appendChild(input);
input.focus();

//funcion pra gurdar valores en la celda al escribir
function guardarValor() {
  const nuevoValor = input.value;

  // NIVEL 6: revisar ciclos ANTES de guardar
  if (nuevoValor.trim().startsWith("=") && formulaCreaCiclo(idCelda, nuevoValor.trim())) {
    td.textContent = "#REF-CIRCULAR!";
    return;
  }

  datosHojas[idCelda] = nuevoValor;
  actualizarDependencias(idCelda, nuevoValor); // NIVEL 4
  recalcularCelda(idCelda);                    // muestra el resultado DE MANEJO DE ERRORES
  propagarCambios(idCelda);                    // NIVEL 4: recalcula en cadena
}

input.addEventListener("keydown", function (evento) {
if (evento.key === "Enter") {
guardarValor();
}
});

input.addEventListener("blur", guardarValor);
}

document.addEventListener("DOMContentLoaded", cuadricula); 

