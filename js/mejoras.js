//8 mejoras 
//Negativos en rojo
//Formato de moneda (clic derecho en la celda)
//3) Deshacer con Ctrl+Z

const formatoMoneda = new Set();

function mostrarEnCelda(td, idCelda, valor) {
  if (typeof valor === "number") {
    td.style.color = valor < 0 ? "red" : "";

    if (formatoMoneda.has(idCelda)) {
      td.textContent = "Q " + valor.toFixed(2);
    } else {
      td.textContent = valor;
    }
  } else {
    td.style.color = "";
    td.textContent = valor;
  }
}

const historialDeshacer = [];

function deshacer() {
  if (historialDeshacer.length === 0) return;

  const cambio = historialDeshacer.pop();
  const valorRestaurado = cambio.valorAnterior || "";

  datosHojas[cambio.idCelda] = valorRestaurado;
  actualizarDependencias(cambio.idCelda, valorRestaurado);
  recalcularCelda(cambio.idCelda);
  propagarCambios(cambio.idCelda);
  guardarEnLocalStorage();
}

document.addEventListener("keydown", function (evento) {
  if (evento.ctrlKey && evento.key.toLowerCase() === "z") {
    evento.preventDefault();
    deshacer();
  }
});