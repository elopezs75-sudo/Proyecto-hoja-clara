//Nivel 3 Evaluador de expresiones

function tokenizar(formula) {
const tokens = [];
let i = 0;

while (i < formula.length) {
 const caracter = formula[i];
if (caracter === " ") {
 i++;
continue;
}
 if (/[0-9.]/.test(caracter)) {
 let numero = "";
 while (i < formula.length && /[0-9.]/.test(formula[i])) {
numero += formula[i];
 i++;
}
tokens.push(numero);
continue;
}
// Referencia de celda: letras seguidas de numeros 

if (/[A-Z]/.test(caracter)) {
let referencia = "";
 while (i < formula.length && /[A-Z]/.test(formula[i])) {
referencia += formula[i];
 i++;
}
while (i < formula.length && /[0-9]/.test(formula[i])) {
referencia += formula[i];
i++;
}
tokens.push(referencia);
continue;
}

if ("+-*/()".includes(caracter)) {
tokens.push(caracter);
i++;
 continue;
}

 throw new Error("Caracter no reconocido: " + caracter);
 }
return tokens;
}

function precedencia(operador) {
  if (operador === "+" || operador === "-") return 1;
  if (operador === "*" || operador === "/") return 2;
  return 0;
}

function aplicarOperador(operador, a, b) {
switch (operador) {
case "+": return a + b;
case "-": return a - b;
case "*": return a * b;
case "/":
if (b === 0) throw new Error("#DIV/0!");
return a / b;
 }
}

function valorDeToken(token) {
if (/^[A-Z]/.test(token)) {
const contenido = datosHojas[token];
if (contenido === undefined || contenido === "") return 0;
if (contenido.trim().startsWith("=")) {
return calcularFormula(contenido.trim());
}
return parseFloat(contenido);
}
return parseFloat(token);
}

function evaluarTokens(tokens) {
const pilaValores = [];
const pilaOperadores = [];

function resolverUno() {
const operador = pilaOperadores.pop();
const b = pilaValores.pop();
const a = pilaValores.pop();
pilaValores.push(aplicarOperador(operador, a, b));
}

for (let i = 0; i < tokens.length; i++) {
const token = tokens[i];

if (token === "(") {
pilaOperadores.push(token);
} else if (token === ")") {
while (pilaOperadores[pilaOperadores.length - 1] !== "(") {
esolverUno();
}
pilaOperadores.pop();
} else if ("+-*/".includes(token)) {
 while (
pilaOperadores.length > 0 &&
pilaOperadores[pilaOperadores.length - 1] !== "(" &&
precedencia(pilaOperadores[pilaOperadores.length - 1]) >= precedencia(token)
) {
resolverUno();
}
pilaOperadores.push(token);
} else {
pilaValores.push(valorDeToken(token));
}
}

while (pilaOperadores.length > 0) {
resolverUno();
}

return pilaValores[0];
}

function calcularFormula(contenidoCelda) {
  let formulaSinIgual = contenidoCelda.substring(1);//cambio por let 
  formulaSinIgual = expandirFunciones(formulaSinIgual);//nivel 5 implementado
const tokens = tokenizar(formulaSinIgual);
return evaluarTokens(tokens);
}