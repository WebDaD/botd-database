const program = require('commander')
const moment = require('moment')
const jsonfile = require('jsonfile')
const jsonxml = require('jsontoxml')
const fs = require('fs')

program
  .version('1.0.0')
  .usage('[options]')
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
  .parse(process.argv)

switch (program.mode) {
  case 'import':
    importCSV(program.csv, program.blessings, program.delimeter, program.newline, program.headers, program.importmode, function (error) {
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
        exportCSV(program.csv, program.blessings, program.delimeter, program.newline, program.headers, function (error) {
          if (error) {
            console.error(error)
          } else {
            console.log('Export Succesful!')
          }
        })
        break
      case 'xml':
        exportXML(program.xml, program.blessings, function (error) {
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
function importCSV (csv, blessings, delimeter, newline, headers, importmode, callback) {
  jsonfile.readFile(blessings, function (err, obj) {
    if (err) {
      callback(err)
    } else {
      if (importmode === 'create') {
        obj = []
      }
      fs.readFile(csv, 'utf8', function (err, data) {
        if (err) {
          callback(err)
        } else {
          var lines = data.split(newline)
          for (let index = (headers ? 1 : 0); index < lines.length; index++) {
            var line = lines[index].trim()
            var content = line.split(delimeter)
            var b = {
              blessing: content[0],
              source: content[1],
              language: content[2]
            }
            if (importmode === 'append-no-doubles' && isInArray(obj, b)) {
              continue
            }
            obj.push(b)
          }
          jsonfile.writeFile(blessings, obj, {spaces: 2}, callback)
        }
      })
    }
  })
}
function exportCSV (csv, blessings, delimeter, newline, headers, callback) {
  jsonfile.readFile(blessings, function (err, obj) {
    if (err) {
      callback(err)
    } else {
      var exportString = ''
      if (headers) {
        exportString += 'blessing'
        exportString += delimeter
        exportString += 'source'
        exportString += delimeter
        exportString += 'language'
        exportString += newline
      }
      for (let index = 0; index < obj.length; index++) {
        const element = obj[index]
        exportString += element.blessing
        exportString += delimeter
        exportString += element.source
        exportString += delimeter
        exportString += element.language
        exportString += newline
      }
      fs.writeFile(csv, exportString, 'utf8', callback)
    }
  })
}
function exportXML (xml, blessings, callback) {
  jsonfile.readFile(blessings, function (err, obj) {
    if (err) {
      callback(err)
    } else {
      var exportString = '<?xml version="1.0" encoding="UTF-8"?><blessings>'
      console.log(obj)
      for (let index = 0; index < obj.length; index++) {
        const element = obj[index]
        exportString += '<blessing>'
        exportString += '<blessing>' + element.blessing + '</blessing>'
        exportString += '<source>' + element.source + '</source>'
        exportString += '<language>' + element.language + '</language>'
        exportString += '</blessing>'
      }
      exportString += '</blessings>'
      fs.writeFile(xml, exportString, 'utf8', callback)
    }
  })
}
function createCalendar (year, blessings, callback) {
  jsonfile.readFile(blessings, function (err, obj) {
    if (err) {
      callback(err)
    } else {
      obj = arrayRemix(obj)
      var yearJSON = {}
      var start = moment(year + '-01-01')
      var stop = moment(year + '-12-31')
      let k = 0
      for (var m = moment(start); m.diff(stop, 'days') <= 0; m.add(1, 'days')) {
        yearJSON[m.format('YYYYMMDD')] = obj[k]
        k++
        if (k === obj.length - 1) {
          obj = arrayRemix(obj)
          k = 0
        }
      }
      jsonfile.writeFile(year + '.json', yearJSON, callback)
    }
  })
}
function arrayRemix (a) {
  var j, x, i
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1))
    x = a[i]
    a[i] = a[j]
    a[j] = x
  }
  return a
}
function isInArray (array, blessing) {
  for (let index = 0; index < array.length; index++) {
    const element = array[index]
    if (element.blessing === blessing.blessing && element.source === blessing.source && element.language === blessing.language) {
      return true
    }
  }
  return false
}
