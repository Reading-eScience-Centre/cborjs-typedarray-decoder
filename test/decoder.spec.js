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
    var arr = new Uint8Array(16)
    // null = unsupported in current browsers
    var types = {
      64: Uint8Array,
      65: Uint16Array,
      66: Uint32Array,
      67: null, // Uint64
      68: Uint8ClampedArray,
      69: Uint16Array,
      70: Uint32Array,
      71: null, // Uint64
      72: Int8Array,
      73: Int16Array,
      74: Int32Array,
      75: null, // Int64
      77: Int16Array,
      78: Int32Array,
      79: null, // Int64
      80: null, // Float16
      81: Float32Array,
      82: Float64Array,
      83: null, // Float128
      84: null, // Float16
      85: Float32Array,
      86: Float64Array,
      87: null // Float128
    }
    
    for (tag in types) {
      if (types[tag] === null) {
        assert.throws(function() {TypedArrayDecoder.decode(arr, tag)}, Error)
      } else {
        var ta = TypedArrayDecoder.decode(arr, tag)
        assert(ta instanceof types[tag])
      }
    }
  })
})
