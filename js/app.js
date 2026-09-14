const numero_filas = 20;
const numero_columnas = 15;
 
function numerocolumna(numeroColumna) {
  let letra = "";
  let n = numeroColumna;
  while (n >= 0) {
    letra = String.fromCharCode(65 + (n % 26)) + letra; 
    n = Math.floor(n / 26) - 1;
  }
  return letra;
}
 
// Genera la cuadrícula
function cuadricula() {
  const contenedor = document.getElementById("Hoja calculo");
 
  const tabla = document.createElement("table"); 
  tabla.id = "Hojacalculo";
 
  //encabezado
  const encabezado = document.createElement("tr");
 
  const esquina = document.createElement("th");
  encabezado.appendChild(esquina); 
 
  for (let col = 0; col < numero_columnas; col++) {
    const th = document.createElement("th");
    th.textContent = numerocolumna(col);
    encabezado.appendChild(th);
  }
  tabla.appendChild(encabezado);
 
  // filas de los datos
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
 
      tr.appendChild(td);
    }
 
    tabla.appendChild(tr);
  }
 
  contenedor.appendChild(tabla);
}
 
document.addEventListener("DOMContentLoaded", cuadricula); // minúscula, igual que la función