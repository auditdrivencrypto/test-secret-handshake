var fs = require('fs'), path = require('path')
var map = require('./map')
var tape = require('tape')

module.exports = function (crypto) {
  var data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8'), 
null, function (e) {
    if(/^\:base64\:/.test(e)) return new Buffer(e.substring(8), 'base64')
    return e
  }
  )
  data = map(data, function (value, key) {
    if(key === 'name') return value
    if(typeof value === 'string')
      return new Buffer(value, 'base64')
    return value
  })

  data.forEach(function (vector, i) {
    if(vector.name !== 'clean')
    tape('vector: '+i+', '+vector.name, function (t) {
//      console.log(vector.name, vector.args)
      t.deepEqual(crypto[vector.name].apply(null, vector.args), vector.result)
      t.end()
    })
  })
}

if(!module.parent)
  module.exports(require('secret-handshake/crypto'))






