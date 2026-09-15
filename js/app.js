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

// Nivel 1: Genera la cuadricula
function cuadricula() {
  const contenedor = document.getElementById("Hoja calculo");

  const tabla = document.createElement("table");
  tabla.id = "Hojacalculo";

  const encabezado = document.createElement("tr");
  const esquina = document.createElement("th");
  encabezado.appendChild(esquina);

  for (let col = 0; col < numero_columnas; col++) {
    const th = document.createElement("th");
    th.textContent = numerocolumna(col);
    encabezado.appendChild(th);
  }
  tabla.appendChild(encabezado);

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

      // NIVEL 2: doble clic activa edicion
      td.addEventListener("dblclick", function () {
        activarEdicion(td, idCelda);
      });

      // NIVEL 8: clic derecho activa/desactiva formato moneda
      td.addEventListener("contextmenu", function (evento) {
        evento.preventDefault();
        if (formatoMoneda.has(idCelda)) {
          formatoMoneda.delete(idCelda);
        } else {
          formatoMoneda.add(idCelda);
        }
        recalcularCelda(idCelda);
      });

      tr.appendChild(td);
    }

    tabla.appendChild(tr);
  }

  contenedor.appendChild(tabla);
}

// NIVEL 2: activar edicion de una celda
function activarEdicion(td, idCelda) {
  if (td.querySelector("input")) return;

  const valorActual = datosHojas[idCelda] || "";

  td.textContent = "";
  const input = document.createElement("input");
  input.type = "text";
  input.value = valorActual;
  td.appendChild(input);
  input.focus();

  function guardarValor() {
    const nuevoValor = input.value;

    // NIVEL 6: revisar ciclos ANTES de guardar
    if (nuevoValor.trim().startsWith("=") && formulaCreaCiclo(idCelda, nuevoValor.trim())) {
      td.textContent = "#REF-CIRCULAR!";
      return;
    }

    // NIVEL 8: guardamos el valor anterior para poder deshacer
    historialDeshacer.push({ idCelda: idCelda, valorAnterior: datosHojas[idCelda] });

    datosHojas[idCelda] = nuevoValor;
    actualizarDependencias(idCelda, nuevoValor); // NIVEL 4
    recalcularCelda(idCelda);                    // muestra el resultado (con manejo de errores)
    propagarCambios(idCelda);                    // NIVEL 4: recalcula en cadena
    guardarEnLocalStorage();                     // NIVEL 7: guardado automatico
  }

  input.addEventListener("keydown", function (evento) {
    if (evento.key === "Enter") {
      guardarValor();
    }
  });

  input.addEventListener("blur", guardarValor);
}

// Al cargar la pagina: generar la cuadricula y luego cargar datos guardados
document.addEventListener("DOMContentLoaded", function () {
  cuadricula();
  cargarDesdeLocalStorage();
});