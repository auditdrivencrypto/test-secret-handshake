module.exports = 
function map (obj, iter, k) {
  if(Buffer.isBuffer(obj) || 'object' !== typeof obj || !obj) return iter(obj, k)

  var _obj = new obj.constructor()
  for(var k in obj) {
    _obj[k] = map(obj[k], iter, k)
  }
  return _obj
}


