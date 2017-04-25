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
  return {
    local: {
      kx_pk: new Buffer(a.local.kx_pk),
      app_mac: new Buffer(a.local.app_mac)
    }
  }
}

input_filters.verifyChallenge = function (a) {
  return {
    app_key: new Buffer(a.app_key),
    local: {
      kx_sk: new Buffer(a.local.kx_sk)
    },
    remote: {}
  }
}

input_filters.clientVerifyChallenge = function (a) {
  return {
    app_key: new Buffer(a.app_key),
    local: {
      kx_sk: new Buffer(a.local.kx_sk),
      secretKey: new Buffer(a.local.secretKey),
      publicKey: new Buffer(a.local.publicKey)
    },
    remote: {
      publicKey: new Buffer(a.remote.publicKey)
    }
  }
}

input_filters.clientCreateAuth = function (a) {
  return {
    local: {
      hello: new Buffer(a.local.hello)
    },
    secret2: new Buffer(a.secret2)
  }
}

input_filters.serverVerifyAuth = function (a) {
  return a
}

input_filters.serverCreateAccept = function (a) {
  return {
    app_key: new Buffer(a.app_key),
    local: {
      publicKey: new Buffer(a.local.publicKey),
      secretKey: new Buffer(a.local.secretKey)
    },
    remote: {
      hello: new Buffer(a.remote.hello)
    },
    shash: new Buffer(a.shash),
    secret3: new Buffer(a.secret3)
  }
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

function clone (m) {
  return map(m, function (v) { return Buffer.isBuffer(v) ? new Buffer(v) : v })
}

function wrap (crypto, output) {

  function wrapFn (fn, name) {
    return function () {
      var args = [].slice.call(arguments)
      var saved_input_state = clone(args[0])
      var filter = input_filters[name]
      args[0] = filter(args[0])
      var saved_filtered_input_state = clone(args[0])
      var result = fn.apply(null, args)
      args[0] = saved_filtered_input_state // revert the change fn made on its input
      output(clone({name: name, args: args, result: result}))
      args[0] = saved_input_state
      return fn.apply(null, args)
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










