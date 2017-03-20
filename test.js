var fs = require('fs'), path = require('path')
var map = require('./map')
var tape = require('tape')

module.exports = function (crypto) {
  var data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8'), null, 2)
  data = map(data, function (value, key) {
    if('string' !== typeof value) return value

    if(!/^([0-9a-f]{2})+$/.test(value)) return value //not hex
    return new Buffer(value, 'hex')
  })

  data.forEach(function (vector, i) {
    if(vector.name !== 'clean')
    tape('vector: '+i+', '+vector.name, function (t) {
      t.deepEqual(crypto[vector.name].apply(null, vector.args), vector.result)
      t.end()
    })
  })
}

if(!module.parent)
  module.exports(require('secret-handshake/crypto'))















