var program = require('commander')
program
  .version('0.1.0')
  .command('database [args]', 'database commands')
  .command('generator [args]', 'generator commands')
  .parse(process.argv)
