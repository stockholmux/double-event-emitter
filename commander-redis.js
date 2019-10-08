const 
    program = require('commander');

program
    .option('-p, --port <value>','Redis Port',6379)
    .option('-a, --auth <value> [optional]','Redis Auth')
    .option('-h, --host <value>','Redis Host','localhost')
    .parse(process.argv);

module.exports = {
    port        : program.port,
    password    : program.auth,
    host        : program.host
};