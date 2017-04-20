// vim: set expandtab ts=2:
//var JSONB = require('json-buffer')
var fs = require('fs')
var path = require('path')
var map = require('./map')

input_filters = {}
input_filters.initialize = function (a) {
  b = {
    app_key: new Buffer(a.app_key),
    random: new Buffer(a.random)
  }
  if (a.seed) b.seed = new Buffer(a.seed)
  if (a.local) {
    x = {}
    if (a.local.publicKey) x.publicKey = new Buffer(a.local.publicKey)
    if (a.local.secretKey) x.secretKey = new Buffer(a.local.secretKey)
    if (x != {}) b.local = x
  }
  if (a.remote) {
    x = {}
    if (a.remote.publicKey) x.publicKey = new Buffer(a.remote.publicKey)
    if (x != {}) b.remote = x
  }
  return b
}
input_filters.createChallenge = function (a) {
  return a
}
input_filters.verifyChallenge = function (a) {
  return a
}
input_filters.clientVerifyChallenge = function (a) {
  return a
}
input_filters.clientCreateAuth = function (a) {
  return a
}
input_filters.serverVerifyAuth = function (a) {
  return a
}
input_filters.serverCreateAccept = function (a) {
  return a
}
input_filters.clean = function (a) {
  return a
}
input_filters.clientVerifyAccept = function (a) {
  return a
}
input_filters.toKeys = function (a) {
  return a
}

function wrap (crypto, output) {

  function wrapFn (fn, name) {
    return function () {
      var args = [].slice.call(arguments)
      args[0] = input_filters[name](args[0])
      var origargs = input_filters[name](args[0])
      var result = fn.apply(null, args)
      args[0] = origargs
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
          if(Buffer.isBuffer(e)) return e.toString('hex')
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










