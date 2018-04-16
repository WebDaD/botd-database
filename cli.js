var program = require('commander')
var moment = require('moment')
var database = require('lib/database')

program
  .version('0.1.0')
  .command('data [args]', 'database commands')
  .option('-c, --csv [csv]', 'Import this CSV to blessings.json or export to this file')
  .option('-x, --xml [xml]', 'Import this XML to blessings.json or export to this file')
  .option('-b, --blessings <blessings>', 'The Blessings-File')
  .option('-i, --importmode [importmode]', 'The Mode to import: create or append or append-no-doubles.', /^(append|create|append-no-doubles)$/i)
  .option('-e, --exportmode [exportmode]', 'The Mode to export: xml or csv.', /^(xml|csv)$/i)
  .option('-m, --mode <mode>', 'Mode of this run. Can be import, export, create', /^(import|create|export)$/i)
  .option('-y, --year [year]', 'For what year.', moment().format('YYYY'))
  .option('-d, --delimeter [delimeter]', 'Delimeter in CSV-File.', ';')
  .option('-n, --newline [newline]', 'Newline in CSV File.', '\n')
  .option('-h, --headers ', 'Header. use if there are or should be header lines')
  .action(function (args, cmd) {
    switch (program.mode) {
      case 'import':
        database.importCSV(program.csv, program.blessings, program.delimeter, program.newline, program.headers, program.importmode, function (error) {
          if (error) {
            console.error(error)
          } else {
            console.log('Import Succesful!')
          }
        })
        break
      case 'export':
        switch (program.exportmode) {
          case 'csv':
            database.exportCSV(program.csv, program.blessings, program.delimeter, program.newline, program.headers, function (error) {
              if (error) {
                console.error(error)
              } else {
                console.log('Export Succesful!')
              }
            })
            break
          case 'xml':
            database.exportXML(program.xml, program.blessings, function (error) {
              if (error) {
                console.error(error)
              } else {
                console.log('Export Succesful!')
              }
            })
            break
          default:
            console.error('Unsupported Mode: ' + program.exportmode)
            break
        }

        break
      case 'create':
        database.createCalendar(program.year, program.blessings, function (error) {
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
  })
  .command('generator [args]', 'generator commands')
  // COPY to dist: blessings.json/csv/xml, feed.php, htaccess
  // COMPILE LESS, PUG to dist
  .parse(process.argv)
