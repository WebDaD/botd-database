var program = require('commander')
var moment = require('moment')
var database = require('./lib/database.js')
var generator = require('./lib/generator.js')
var config = require('./config.json')

program
  .version('0.1.0')

program
  .command('database')
  .alias('data')
  .option('-c, --csv [csv]', 'Import this CSV to blessings.json or export to this file')
  .option('-x, --xml [xml]', 'Import this XML to blessings.json or export to this file')
  .option('-b, --blessings [blessings]', 'The Blessings-File')
  .option('-i, --importmode [importmode]', 'The Mode to import: create or append or append-no-doubles.', /^(append|create|append-no-doubles)$/i)
  .option('-e, --exportmode [exportmode]', 'The Mode to export: xml or csv.', /^(xml|csv)$/i)
  .option('-m, --mode [mode]', 'Mode of this run. Can be import, export, create', /^(import|create|export)$/i)
  .option('-y, --year [year]', 'For what year.', moment().format('YYYY'))
  .option('-d, --delimeter [delimeter]', 'Delimeter in CSV-File.', ';')
  .option('-n, --newline [newline]', 'Newline in CSV File.', '\n')
  .option('-h, --headers ', 'Header. use if there are or should be header lines')
  .action(function (args, options) {
    switch (options.mode) {
      case 'import':
        database.importCSV(options.csv, options.blessings, options.delimeter, options.newline, options.headers, options.importmode, function (error) {
          if (error) {
            console.error(error)
          } else {
            console.log('Import Succesful!')
          }
        })
        break
      case 'export':
        switch (options.exportmode) {
          case 'csv':
            database.exportCSV(options.csv, options.blessings, options.delimeter, options.newline, options.headers, function (error) {
              if (error) {
                console.error(error)
              } else {
                console.log('Export Succesful!')
              }
            })
            break
          case 'xml':
            database.exportXML(options.xml, options.blessings, function (error) {
              if (error) {
                console.error(error)
              } else {
                console.log('Export Succesful!')
              }
            })
            break
          default:
            console.error('Unsupported Mode: ' + options.exportmode)
            break
        }

        break
      case 'create':
        database.createCalendar(options.year, options.blessings, function (error) {
          if (error) {
            console.error(error)
          } else {
            console.log('Creation Succesful!')
          }
        })
        break
      default:
        console.error('Mode ' + options.mode + ' not avaiable.')
    }
  })
program
  .command('generator')
  .alias('gen')
  .option('-f, --folder <folder>', 'Base Folder', '.')
  .option('-o, --output <output>', 'The output Directoy', 'dist')
  .option('-y, --year <year>', 'For what year.', moment().format('YYYY'))
  .action(function (options) {
    if (options.folder === '.') {
      options.folder = __dirname
    }
    generator.createCSS(options.folder, options.output, function (error, result) {
      if (error) {
        console.error(error)
      } else {
        generator.copyStatic(options.folder, options.output, config, function (error, result) {
          if (error) {
            console.error(error)
          } else {
            generator.createPages(options.folder, options.output, options.year, config)
            console.log('All Done, you may now ftp your stuff.')
          }
        })
      }
    })
  })
program.parse(process.argv)
