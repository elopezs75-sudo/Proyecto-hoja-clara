
//NIVEL 4 - Referencias entre celdas y recalculo en cadena

const dependientes = {};

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

  let valorMostrar;

  if (contenido && contenido.trim().startsWith("=")) {
    try {
      const resultado = calcularFormula(contenido.trim());
      valorMostrar = (resultado === undefined || Number.isNaN(resultado)) ? "#ERROR!" : resultado;
    } catch (error) {
      valorMostrar = (error.message === "#DIV/0!") ? "#DIV/0!" : "#ERROR!";
    }
  } else if (contenido !== undefined && contenido.trim() !== "" && !Number.isNaN(parseFloat(contenido))) {
    valorMostrar = parseFloat(contenido);
  } else {
    valorMostrar = contenido || "";
  }

  mostrarEnCelda(td, idCelda, valorMostrar);
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

//NIVEL 6 - Deteccion de referencias circulares 

function obtenerReferenciasDeContenido(contenido) {
  if (!contenido || !contenido.trim().startsWith("=")) return [];
  return obtenerReferencias(contenido.trim());
}

function existeCicloDesde(idCeldaActual, idCeldaBuscada, visitadas) {
  visitadas = visitadas || new Set();
  if (visitadas.has(idCeldaActual)) return false;
  visitadas.add(idCeldaActual);

  const referencias = obtenerReferenciasDeContenido(datosHojas[idCeldaActual]);

  for (let i = 0; i < referencias.length; i++) {
    const referencia = referencias[i];
    if (referencia === idCeldaBuscada) return true;
    if (existeCicloDesde(referencia, idCeldaBuscada, visitadas)) return true;
  }
  return false;
}

function formulaCreaCiclo(idCelda, nuevaFormula) {
  const referenciasDirectas = obtenerReferenciasDeContenido(nuevaFormula);

  for (let i = 0; i < referenciasDirectas.length; i++) {
    const referencia = referenciasDirectas[i];
    if (referencia === idCelda) return true;
    if (existeCicloDesde(referencia, idCelda)) return true;
  }
  return false;
}