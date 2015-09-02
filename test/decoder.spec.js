var assert = require('assert')
var TypedArrayDecoder = require('../decoder.js')

function isPlatformLittleEndian () {
  var buffer = new ArrayBuffer(2)
  new DataView(buffer).setInt16(0, 256, true)
  return new Int16Array(buffer)[0] === 256
}

describe('decoder', function() {
  it('should perform endianness conversion', function() {
    var data = [14, 1, 2888, 4543222]
    var typedArr = new Uint32Array(data.length)
    for (var i=0; i < data.length; i++) {
      typedArr[i] = data[i]
    }
    
    // change endianness
    var little = isPlatformLittleEndian()
    var dv = new DataView(typedArr.buffer)
    for (var i=0; i < typedArr.length; i++) {
      dv.setUint32(i*4, typedArr[i], !little)
    }
    
    // check if the decoder can read it
    var arr = new Uint8Array(typedArr.buffer)
    var tag = little ? 66 : 70
    var result = TypedArrayDecoder.decode(arr, tag)
    var resultArr = Array.prototype.slice.call(result)
    
    assert.deepEqual(resultArr, data)
  })
  it('should choose the correct array type', function() {
    // TODO    
  })
})
