var program = require('commander')
var moment = require('moment')
var database = require('./lib/database.js')
var generator = require('./lib/generator.js')
var config = require('./config.json')

program
  .version('0.1.0')

program
  .command('import')
  .alias('i')
  .option('-c, --csv [csv]', 'Import this CSV to blessings.json')
  .option('-x, --xml [xml]', 'Import this XML to blessings.json')
  .option('-b, --blessings [blessings]', 'The Blessings-File')
  .option('-i, --importmode [importmode]', 'The Mode to import: create or append or append-no-doubles.', /^(append|create|append-no-doubles)$/i)
  .option('-d, --delimeter [delimeter]', 'Delimeter in CSV-File.', ';')
  .option('-n, --newline [newline]', 'Newline in CSV File.', '\n')
  .option('-h, --headers ', 'Header. use if there are or should be header lines')
  .action(function (args, options) {
    database.importCSV(options.csv, options.blessings, options.delimeter, options.newline, options.headers, options.importmode, function (error) {
      if (error) {
        console.error(error)
      } else {
        console.log('Import Succesful!')
      }
    })
  })

program
  .command('export')
  .alias('e')
  .option('-c, --csv [csv]', 'Export to this CSV from blessings.json')
  .option('-x, --xml [xml]', 'Export to this XML from blessings.json')
  .option('-b, --blessings [blessings]', 'The Blessings-File')
  .option('-e, --exportmode [exportmode]', 'The Mode to export: xml or csv.', /^(xml|csv)$/i)
  .option('-d, --delimeter [delimeter]', 'Delimeter in CSV-File.', ';')
  .option('-n, --newline [newline]', 'Newline in CSV File.', '\n')
  .option('-h, --headers ', 'Header. use if there are or should be header lines')
  .action(function (args, options) {
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
  })

program
  .command('calendar')
  .alias('c')
  .option('-b, --blessings [blessings]', 'The Blessings-File')
  .option('-y, --year [year]', 'For what year.', moment().format('YYYY'))
  .action(function (args, options) {
    database.createCalendar(options.year, options.blessings, function (error) {
      if (error) {
        console.error(error)
      } else {
        console.log('Creation Succesful!')
      }
    })
  })

program
  .command('generator')
  .alias('g')
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
