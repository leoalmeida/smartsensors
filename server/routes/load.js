const program = require('commander');

program
  .version('1.0.0')
  .option('-f, --file [value]', 'Arquivo para leitura')
  .parse(process.argv)

const Lancamento = require('./model/lancamento-model');
const xlsx = require('node-xlsx');

const worksheet = xlsx.parse(program.file)
const primeiraAba = worksheet[0];
const dados = primeiraAba.data;

const lancementos = []

for (let i=1; i<dados.length;i++){
    const dado = dados[i];

    // lancementos.push(new Lancamento(...dado));

}
console.log(lancementos);
