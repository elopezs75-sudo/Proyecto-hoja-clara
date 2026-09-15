//funcionnes de rangos

function columnaANumero(letra) {
  let numero = 0;
  for (let i = 0; i < letra.length; i++) {
    numero = numero * 26 + (letra.charCodeAt(i) - 64);
  }
  return numero - 1;
}

function obtenerValorCeldaSimple(idCelda) {
  const contenido = datosHojas[idCelda];
  if (contenido === undefined || contenido === "") return 0;
  if (contenido.trim().startsWith("=")) {
    return calcularFormula(contenido.trim());
  }
  return parseFloat(contenido) || 0;
}

function obtenerValoresRango(celdaInicio, celdaFin) {
  const partesInicio = celdaInicio.match(/^([A-Z]+)([0-9]+)$/);
  const partesFin = celdaFin.match(/^([A-Z]+)([0-9]+)$/);

  const colInicio = partesInicio[1];
  const filaInicio = parseInt(partesInicio[2]);
  const colFin = partesFin[1];
  const filaFin = parseInt(partesFin[2]);

  const valores = [];

  if (colInicio === colFin) {
    for (let f = filaInicio; f <= filaFin; f++) {
      valores.push(obtenerValorCeldaSimple(colInicio + f));
    }
  } else if (filaInicio === filaFin) {
    const nInicio = columnaANumero(colInicio);
    const nFin = columnaANumero(colFin);
    for (let c = nInicio; c <= nFin; c++) {
      valores.push(obtenerValorCeldaSimple(numerocolumna(c) + filaInicio));
    }
  }

  return valores;
}

function expandirFunciones(formula) {
  const regexFuncion = /(SUMA|PROMEDIO|MAX|MIN)\(([A-Z]+[0-9]+):([A-Z]+[0-9]+)\)/g;

  return formula.replace(regexFuncion, function (coincidenciaCompleta, nombreFuncion, celdaInicio, celdaFin) {
    const valores = obtenerValoresRango(celdaInicio, celdaFin);
    let resultado = 0;

    if (nombreFuncion === "SUMA") {
      resultado = valores.reduce(function (acumulado, valor) { return acumulado + valor; }, 0);
    } else if (nombreFuncion === "PROMEDIO") {
      const suma = valores.reduce(function (acumulado, valor) { return acumulado + valor; }, 0);
      resultado = valores.length > 0 ? suma / valores.length : 0;
    } else if (nombreFuncion === "MAX") {
      resultado = Math.max.apply(null, valores);
    } else if (nombreFuncion === "MIN") {
      resultado = Math.min.apply(null, valores);
    }

    return resultado;
  });
}