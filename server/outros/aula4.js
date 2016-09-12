'use strict';


/* Prototype -> '__proto__'
      habilita o desenvolvedor a manipular a herança no JS */
console.log(Person.prototype.__proto__== {}.__proto__);

function Person(name){
  this.name = name;
}

Person.prototype.speak = function(){
  console.log(this.name);
}

var sexualidade = {
  sexo: 'masculino'

  this.speak = function(){
    console.log(this.name);
  }
}

var pessoa = {
  nome: 'Leonardo Almeida',
  idade: 24,
  __proto__ = sexualidade
}

Object.setPrototype(pessoa, sexualidade);

var renan = Object.create(pessoa);

console.log(renan);

/* Shadowing ->  */

/* Namespace ->  */
