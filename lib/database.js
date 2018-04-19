var jsonfile = require('jsonfile')
var moment = require('moment')
var fs = require('fs')
exports.importCSV = function (csv, blessings, delimeter, newline, headers, importmode, callback) {
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
              text: content[0],
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
exports.exportCSV = function (csv, blessings, delimeter, newline, headers) {
  var obj = jsonfile.readFileSync(blessings)
  var exportString = ''
  if (headers) {
    exportString += 'text'
    exportString += delimeter
    exportString += 'source'
    exportString += delimeter
    exportString += 'language'
    exportString += newline
  }
  for (let index = 0; index < obj.length; index++) {
    const element = obj[index]
    exportString += '"' + element.text + '"'
    exportString += delimeter
    exportString += '"' + element.source + '"'
    exportString += delimeter
    exportString += '"' + element.language + '"'
    exportString += newline
  }
  fs.writeFileSync(csv, exportString, 'utf8')
}
exports.exportXML = function (xml, blessings) {
  var obj = jsonfile.readFileSync(blessings) 
  var exportString = '<?xml version="1.0" encoding="UTF-8"?><blessings>'
  for (let index = 0; index < obj.length; index++) {
    const element = obj[index]
    exportString += '<blessing>'
    exportString += '<text>' + element.text + '</text>'
    exportString += '<source>' + element.source + '</source>'
    exportString += '<language>' + element.language + '</language>'
    exportString += '</blessing>'
  }
  exportString += '</blessings>'
  fs.writeFileSync(xml, exportString, 'utf8')
}
exports.exportCalendarCSV = function (csv, cal, delimeter, newline, headers) {
  var obj = jsonfile.readFileSync(cal)
  var exportString = ''
  if (headers) {
    exportString += 'date'
    exportString += delimeter
    exportString += 'text'
    exportString += delimeter
    exportString += 'source'
    exportString += delimeter
    exportString += 'language'
    exportString += newline
  }
  for (var blessing in obj) {
    if (obj.hasOwnProperty(blessing)) {
      exportString += '"' + blessing + '"'
      exportString += delimeter
      exportString += '"' + obj[blessing].text + '"'
      exportString += delimeter
      exportString += '"' + obj[blessing].source + '"'
      exportString += delimeter
      exportString += '"' + obj[blessing].language + '"'
      exportString += newline
    }
  }
  fs.writeFileSync(csv, exportString, 'utf8')
}
exports.exportCalendarXML = function (xml, cal) {
  var obj = jsonfile.readFileSync(cal) 
  var exportString = '<?xml version="1.0" encoding="UTF-8"?><blessings>'
  for (var blessing in obj) {
    if (obj.hasOwnProperty(blessing)) {
      exportString += '<blessing>'
      exportString += '<date>' + blessing + '</date>'
      exportString += '<text>' + obj[blessing].text + '</text>'
      exportString += '<source>' + obj[blessing].source + '</source>'
      exportString += '<language>' + obj[blessing].language + '</language>'
      exportString += '</blessing>'
    }
  }
  exportString += '</blessings>'
  fs.writeFileSync(xml, exportString, 'utf8')
}
exports.createCalendar = function (year, blessings, callback) {
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
