//var JSONB = require('json-buffer')
var fs = require('fs')
var path = require('path')
var map = require('./map')

function wrap (crypto, output) {

  function wrapFn (fn, name) {
    return function () {
      var args = [].slice.call(arguments)
      var result = fn.apply(null, args)
      output(map({name: name, args: args, result: result}, function (v) {
        //clone every object
        if(Buffer.isBuffer(v)) return new Buffer(v)
        return v
      }))
      return result
    }
  }

  for(var k in crypto) {
    if('function' === typeof crypto[k])
      crypto[k] = wrapFn(crypto[k], k)
  }
  return crypto
}

var output = []

var c = require('secret-handshake/crypto')
wrap(c, function (b) { output.push(b) })
process.on('exit', function () {

  fs.writeFileSync(
    path.join(__dirname, 'data.json'),
    '[\n' + output.map(function (obj) {
        obj = map(obj, function (e) {
//          if(Buffer.isBuffer(e)) console.log(e.toString('base64'))
          if(Buffer.isBuffer(e)) return e.toString('base64')
          return e
        })
        console.log(obj)
        return JSON.stringify(obj, null, 2)
      }).join(',\n')+']',
    'utf8'
  )

})

require('secret-handshake/test/secret-handshake')
require('secret-handshake/test/net1')
//require('secret-handshake/test/net1')
require('secret-handshake/test/net2')
//









