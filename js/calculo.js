
//NIVEL 4 Referencias entre celdas y recalculo en cadena

const dependientes = {};

//cambios de referennccia para la funcion : sumatoria
function obtenerReferencias(formulaConIgual) {
  const formulaSinIgual = formulaConIgual.substring(1);
  const referencias = new Set();

  const regexRango = /([A-Z]+[0-9]+):([A-Z]+[0-9]+)/g;
  const formulaSinRangos = formulaSinIgual.replace(regexRango, function (coincidencia, celdaInicio, celdaFin) {
    const partesInicio = celdaInicio.match(/^([A-Z]+)([0-9]+)$/);
    const partesFin = celdaFin.match(/^([A-Z]+)([0-9]+)$/);
    const colInicio = partesInicio[1];
    const filaInicio = parseInt(partesInicio[2]);
    const colFin = partesFin[1];
    const filaFin = parseInt(partesFin[2]);

    if (colInicio === colFin) {
      for (let f = filaInicio; f <= filaFin; f++) referencias.add(colInicio + f);
    } else if (filaInicio === filaFin) {
      const nInicio = columnaANumero(colInicio);
      const nFin = columnaANumero(colFin);
      for (let c = nInicio; c <= nFin; c++) referencias.add(numerocolumna(c) + filaInicio);
    }

    return "";
  });

  const regexCelda = /[A-Z]+[0-9]+/g;
  const sueltas = formulaSinRangos.match(regexCelda) || [];
  sueltas.forEach(function (referencia) { referencias.add(referencia); });

  return Array.from(referencias);
}

function actualizarDependencias(idCelda, nuevoValor) {
for (const celda in dependientes) {
 dependientes[celda].delete(idCelda);
  }

if (nuevoValor.trim().startsWith("=")) {
const referencias = obtenerReferencias(nuevoValor.trim());
 referencias.forEach(function (referencia) {
if (!dependientes[referencia]) {
dependientes[referencia] = new Set();
      }
dependientes[referencia].add(idCelda);
});
  }
}

function recalcularCelda(idCelda) {
const contenido = datosHojas[idCelda];
const td = document.getElementById("celda-" + idCelda);
if (!td) return;

if (contenido && contenido.trim().startsWith("=")) {
try {
 const resultado = calcularFormula(contenido.trim());
 td.textContent = resultado;
} catch (error) {
 td.textContent = "#ERROR!";
 }
  } else {
 td.textContent = contenido || "";
  }
}

function propagarCambios(idCelda, visitadas) {
 visitadas = visitadas || new Set();
 if (visitadas.has(idCelda)) return;
 visitadas.add(idCelda);
 const listaDependientes = dependientes[idCelda];
  if (!listaDependientes) return;

listaDependientes.forEach(function (celdaDependiente) {
    recalcularCelda(celdaDependiente);
    propagarCambios(celdaDependiente, visitadas);
  });
}