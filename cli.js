const program = require('commander')
const moment = require('moment')

program
  .version('1.0.0')
  .usage('[options]')
  .option('-c, --csvimport [csv]', 'Import this CSV to blessings.json or export to this file')
  .option('-b, --blessings <blessings>', 'The Blessings-File')
  .option('-i, --importmode [importmode]', 'The Mode to import: create or append.', /^(append|create)$/i)
  .option('-m, --mode <mode>', 'Mode of this run. Can be import, export, create', /^(import|create|export)$/i)
  .option('-y, --year [year]', 'For what year.', moment().format('YYYY'))
  .option('-d, --delimeter [delimeter]', 'Delimeter in CSV-File.', ';')
  .option('-n, --newline [newline]', 'Newline in CSV File.', '\n')
  .parse(process.argv)

switch (program.mode) {
  case 'import':
    importCSV(program.csvimport, program.blessings, program.delimeter, program.newline, program.importmode, function (error) {
      if (error) {
        console.error(error)
      } else {
        console.log('Import Succesful!')
      }
    })
    break
  case 'export':
    exportCSV(program.csvimport, program.blessings, program.delimeter, program.newline, function (error) {
      if (error) {
        console.error(error)
      } else {
        console.log('Export Succesful!')
      }
    })
    break
  case 'create':
    createCalendar(program.year, program.blessings, function (error) {
      if (error) {
        console.error(error)
      } else {
        console.log('Creation Succesful!')
      }
    })
    break
  default:
    console.error('Mode ' + program.mode + ' not avaiable.')
}
function importCSV (csv, blessings, delimeter, newline, importmode, callback) {
  // TODO: read in csv
  // TODO: loop line by line (newline)
  // TODO: split fields on delim
  // TODO: check if already in blessings
  // TODO: if no, add to new array or blessings array (importmode)
  // TODO: write array to file blessings

}
function exportCSV (csv, blessings, delimeter, newline, callback) {
  // TODO: loop over blessings, create file line by line
}
function createCalendar (year, blessings, callback) {
  // TODO: import all blessings into array
  // TODO: mix the array up
  // TODO: loop over all dates in year
  // TODO: add entries to array
  // TODO: array to file year.json
}
