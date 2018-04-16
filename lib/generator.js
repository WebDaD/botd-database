const path = require('path')
const fs = require('fs')
var mkdirp = require('mkdirp')
const less = require('less')
const pug = require('pug')
const moment = require('moment')
exports.createCSS = function (folder, output, callback) {
  fs.readFile(path.join(folder, 'assets', 'less', 'main.less'), 'utf8', function (err, data) {
    if (err) {
      callback(err)
    } else {
      less.render(data, {filename: 'main.less', paths: [path.join(folder, 'assets', 'less')]}, function (error, outputCSS) {
        if (error) {
          callback(error)
        } else {
          mkdirp(path.join(output, 'css'), function (error) {
            if (error) {
              callback(error)
            } else {
              fs.writeFile(path.join(output, 'css', 'main.css'), outputCSS.css, function (error) {
                if (error) {
                  callback(error)
                } else {
                  callback(null, true)
                }
              })
            }
          })
          
        }
      })
    }
  })
}
exports.copyStatic = function (folder, output, config, callback) {
  callback('stop here')
  // TODO: copy blessings, make csv and xml, copy legal, about, all, calendar, index, images, php, htaccess to dist
}
exports.createPages = function (folder, year, output, config) {
  var calJSON = require(path.join(folder, 'blessings', year + '.json'))
  for (var date in calJSON) {
    var self = calJSON[date]
    var dm = moment(date, 'YYYYMMDD')
    console.log(dm.format('DD.MM.YYYY'))
    var nm = dm.add(1, 'd')
    var pm = dm.subtract(1, 'd')
    self.day = dm.format('DD.MM.YYYY')
    self.next = nm.format('YYYYMMDD')
    self.nicenext = nm.format('DD.MM.YYYY')
    self.prev = pm.format('YYYYMMDD')
    self.niceprev = pm.format('DD.MM.YYYY')
    var html = pug.renderFile(path.join(folder, 'assets', 'pug', 'page.pug'), Object.assign(config, self))
    fs.writeFileSync(path.join(output, date + '.html'), html)
  }
}
