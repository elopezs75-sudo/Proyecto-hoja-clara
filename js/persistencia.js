//NIVEL 7 - Persistencia 
const CLAVE_LOCALSTORAGE = "hojaClaraDatosAmigo";

function guardarEnLocalStorage() {
  localStorage.setItem(CLAVE_LOCALSTORAGE, JSON.stringify(datosHojas));
}

function cargarDesdeLocalStorage() {
  const guardado = localStorage.getItem(CLAVE_LOCALSTORAGE);
  if (!guardado) return;

  const datosGuardados = JSON.parse(guardado);

  for (const idCelda in datosGuardados) {
    datosHojas[idCelda] = datosGuardados[idCelda];
  }

  for (const idCelda in datosHojas) {
    actualizarDependencias(idCelda, datosHojas[idCelda]);
  }

  for (const idCelda in datosHojas) {
    recalcularCelda(idCelda);
  }
}

function exportarCSV() {
  const filas = [];

  for (let fila = 1; fila <= numero_filas; fila++) {
    const columnasFila = [];
    for (let col = 0; col < numero_columnas; col++) {
      const idCelda = numerocolumna(col) + fila;
      const td = document.getElementById("celda-" + idCelda);
      columnasFila.push(td ? td.textContent : "");
    }
    filas.push(columnasFila.join(","));
  }

  const contenidoCSV = filas.join("\n");

  const blob = new Blob([contenidoCSV], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = "hojaclara.csv";
  enlace.click();
  URL.revokeObjectURL(url);
}