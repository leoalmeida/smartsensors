'use strict';
/* Closure */
function soma(x) {
  return function(y){
    return x + y;
  }
}

var somaParc = soma(10);
console.log(somaParc(10));
console.log(soma(10)(5));

// var resultado = getNome.call(pessoa);
