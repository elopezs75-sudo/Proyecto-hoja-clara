
//NIVEL 4 Referencias entre celdas y recalculo en cadena

const dependientes = {};

function obtenerReferencias(formulaConIgual) {
const formulaSinIgual = formulaConIgual.substring(1);
const tokens = tokenizar(formulaSinIgual);
return tokens.filter(function (token) {
return /^[A-Z]/.test(token);
 });
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