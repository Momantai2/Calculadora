const pantalla = document.getElementById("pantalla");
const botones = document.querySelectorAll("button");

let operacion = "";
let calculado = false;

init();

function esOperador(char) {
  return ["+", "−", "×", "÷"].includes(char);
}

function limpiar() {
  operacion = "";
  calculado = false;
  actualizarPantalla("0");
}

function actualizarPantalla(valor) {
  pantalla.textContent = valor || "0";
}

function calcular(operacion) {
  try {
    let expresion = operacion
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/−/g, "-");

    let resultado = Function('"use strict";return (' + expresion + ")")();

    if (resultado === Infinity || isNaN(resultado)) return "Error";

    return parseFloat(resultado.toFixed(6));
  } catch {
    return "Error";
  }
}

function manejarEntrada(valor) {
  if (valor === "C") {
    limpiar();
    return;
  }

  if (valor === "=") {
    if (operacion.trim() === "") {
      actualizarPantalla("0");
      return;
    }

    if (esOperador(operacion.slice(-1))) {
      operacion = operacion.slice(0, -1);
    }

    let resultado = calcular(operacion);
    actualizarPantalla(resultado);

    operacion = resultado !== "Error" ? resultado.toString() : "";
    calculado = true;
    return;
  }

  if (esOperador(valor)) {
    if (operacion === "" && valor !== "−") return;

    if (esOperador(operacion.slice(-1))) {
      operacion = operacion.slice(0, -1) + valor;
    } else {
      operacion += valor;
    }

    calculado = false;
    actualizarPantalla(operacion);
    return;
  }

  if (calculado) {
    calculado = false;
    operacion = valor;
  } else {
    operacion += valor;
  }

  actualizarPantalla(operacion);
}

function manejarTeclado(e) {
  const tecla = e.key;

  if (!isNaN(tecla)) {
    manejarEntrada(tecla);
  } else if (["+", "-", "*", "/", "."].includes(tecla)) {
    let simbolo = tecla;
    if (tecla === "*") simbolo = "×";
    if (tecla === "/") simbolo = "÷";
    if (tecla === "-") simbolo = "−";
    manejarEntrada(simbolo);
  } else if (tecla === "Enter") {
    manejarEntrada("=");
  } else if (tecla === "Backspace") {
    operacion = operacion.slice(0, -1);
    actualizarPantalla(operacion);
  } else if (tecla.toUpperCase() === "C") {
    manejarEntrada("C");
  }
}

function init() {
  botones.forEach((boton) => {
    boton.addEventListener("click", () => {
      let valor = boton.textContent;

      if (boton.classList.contains("clear")) valor = "C";
      if (boton.classList.contains("igual")) valor = "=";

      manejarEntrada(valor);
    });
  });

  document.addEventListener("keydown", manejarTeclado);
}
