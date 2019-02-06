const path = require('path')
const fs = require('fs')
var mkdirp = require('mkdirp')
const less = require('less')
const pug = require('pug')
const moment = require('moment')
var database = require('./database.js')
var jsonfile = require('jsonfile')
var copydir = require('copy-dir')
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
exports.copyStatic = function (folder, output, config) {
  var blessingJSONFiles = fs.readdirSync(path.join(folder, 'blessings'))
  for (let index = 0; index < blessingJSONFiles.length; index++) {
    const file = blessingJSONFiles[index]
    fs.copyFileSync(path.join(folder, 'blessings', file), path.join(output, file))
    if (path.basename(file, 'json') === 'blessings.') {
      var blessJSON = jsonfile.readFileSync(path.join(folder, 'blessings', file))
      for (let index = 0; index < blessJSON.length; index++) {
        const element = blessJSON[index]
        element.text = element.text.replace(/\n/g, '<br/>')
      }
      database.exportCSV(path.join(output, path.basename(file, 'json') + 'csv'), path.join(folder, 'blessings', file), ';', '\n', true)
      database.exportXML(path.join(output, path.basename(file, 'json') + 'xml'), path.join(folder, 'blessings', file))
      fs.writeFileSync(path.join(output, 'all.html'), pug.renderFile(path.join(folder, 'assets', 'pug', 'all.pug'), {config: config, blessings: blessJSON}))
    } else {
      database.exportCalendarCSV(path.join(output, path.basename(file, 'json') + 'csv'), path.join(folder, 'blessings', file), ';', '\n', true)
      database.exportCalendarXML(path.join(output, path.basename(file, 'json') + 'xml'), path.join(folder, 'blessings', file))
      fs.writeFileSync(path.join(output, 'calendar-' + path.basename(file, 'json') + '.html'),
                        pug.renderFile(
                          path.join(folder, 'assets', 'pug', 'calendar.pug'),
                          Object.assign(config, jsonfile.readFileSync(path.join(folder, 'blessings', file)))))
      // TODO: years.ics (iCAL) https://de.wikipedia.org/wiki/ICalendar
    }
  }
  fs.writeFileSync(path.join(output, 'about.html'), pug.renderFile(path.join(folder, 'assets', 'pug', 'about.pug'), config))
  fs.writeFileSync(path.join(output, 'legal.html'), pug.renderFile(path.join(folder, 'assets', 'pug', 'legal.pug'), config))
  fs.writeFileSync(path.join(output, 'privacy.html'), pug.renderFile(path.join(folder, 'assets', 'pug', 'privacy.pug'), config))
  fs.writeFileSync(path.join(output, 'index.html'), pug.renderFile(path.join(folder, 'assets', 'pug', 'index.pug'), config))
  mkdirp.sync(path.join(output, 'images'))
  copydir.sync(path.join(folder, 'assets', 'images'), path.join(output, 'images'))
  fs.copyFileSync(path.join(folder, 'assets', 'php', 'feed.php'), path.join(output, 'feed.php'))
  fs.copyFileSync(path.join(folder, 'assets', '.htaccess'), path.join(output, '.htaccess'))
}
exports.createImages = function (folder, output, year, config) {
  // TODO: create the images
}
exports.createPages = function (folder, output, year, config) {
  var calJSON = require(path.join(folder, 'blessings', year + '.json'))
  for (var date in calJSON) {
    var self = calJSON[date]
    var dm = moment(date, 'YYYYMMDD')
    console.log(dm.format('DD.MM.YYYY'))
    var nm = dm.clone().add(1, 'd')
    var pm = dm.clone().subtract(1, 'd')
    self.day = dm.format('DD.MM.YYYY')
    self.next = nm.format('YYYYMMDD')
    self.nicenext = nm.format('DD.MM.YYYY')
    self.prev = pm.format('YYYYMMDD')
    self.niceprev = pm.format('DD.MM.YYYY')
    self.text = self.text.replace(/\n/g, '<br/>')
    var html = pug.renderFile(path.join(folder, 'assets', 'pug', 'page.pug'), Object.assign(config, self))
    fs.writeFileSync(path.join(output, date + '.html'), html)
  }
}
