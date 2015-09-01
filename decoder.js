function getFields (tag) {
  return {
    f: (tag & 1 << 4) != 0,
    s: (tag & 1 << 3) != 0,
    e: (tag & 1 << 2) != 0,
    ll: tag & 3
  }
}

function getType (fields) {
  if (fields.f) {
    switch (fields.ll) {
    0: throw new Error('16-bit float arrays not supported')
    1: return Float32Array
    2: return Float64Array
    3: throw new Error('128-bit float arrays not supported') 
    }
  } else {
    if (fields.s) {
      switch (fields.ll) {
      0: return Int8Array
      1: return Int16Array
      2: return Int32Array
      3: throw new Error('64-bit signed integer arrays not supported')
      }
    } else {
      switch (fields.ll) {
      0: return fields.e ? Uint8ClampedArray : Uint8Array
      1: return Uint16Array
      2: return Uint32Array
      3: throw new Error('64-bit unsigned integer arrays not supported')
      }      
    }
  }
}

function isPlatformLittleEndian() {
  var buffer = new ArrayBuffer(2)
  new DataView(buffer).setInt16(0, 256, true)
  return new Int16Array(buffer)[0] === 256
}

function ensurePlatformEndianness (fields, buffer) {
  var platformLE = isPlatformLittleEndian()
  var arrayLE = fields.e
  if (platformLE === arrayLE) {
    return
  }
  var bytes = new Uint8Array(buffer)
  
  // TODO write optimized loops for 16, 32, 64 bits
  throw new Error('endianness mismatch, conversion not implemented yet')
}

var TypedArrayDecoder = function (val, tag) {
  if (!(val instanceof Uint8Array)) {
    throw new Error('Expected Uint8Array, check your version of cbor-js')
  }
  
  var fields = getFields(tag)
  var type = getType(fields)
  
  ensurePlatformEndianness(fields, val.buffer)
  
  var ta = new type(val.buffer)  
  return ta
}

TypedArrayDecoder.tags = []
for (var i = 64; i <= 87; i++) {
  if (i === 76) continue // not used
  TypedArrayDecoder.tags.push(i)
}

module.exports = TypedArrayDecoder
