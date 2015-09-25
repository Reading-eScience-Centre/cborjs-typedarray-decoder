function getFields (tag) {
  return {
    f: (tag & 1 << 4) !== 0,
    s: (tag & 1 << 3) !== 0,
    e: (tag & 1 << 2) !== 0,
    ll: tag & 3
  }
}

function getType (fields) {
  if (fields.f) {
    switch (fields.ll) {
      case 0: throw new Error('16-bit float arrays not supported')
      case 1: return Float32Array
      case 2: return Float64Array
      case 3: throw new Error('128-bit float arrays not supported')
    }
  } else {
    if (fields.s) {
      switch (fields.ll) {
        case 0: return Int8Array
        case 1: return Int16Array
        case 2: return Int32Array
        case 3: throw new Error('64-bit signed integer arrays not supported')
      }
    } else {
      switch (fields.ll) {
        case 0: return fields.e ? Uint8ClampedArray : Uint8Array
        case 1: return Uint16Array
        case 2: return Uint32Array
        case 3: throw new Error('64-bit unsigned integer arrays not supported')
      }
    }
  }
}

function isPlatformLittleEndian () {
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
  var bytesPerEl = 1 << (fields.f + fields.ll)

  if (bytesPerEl === 1) {
    return // 8bit has no endianness
  }
  if (bytesPerEl === 2) {
    swap16(bytes)
  } else if (bytesPerEl === 4) {
    swap32(bytes)
  } else { // 8
    swap64(bytes)
  }
}

function swap16 (bytes) {
  var len = bytes.length
  var holder
  for (var i = 0; i < len + 2; i += 2) {
    holder = bytes[i]
    bytes[i] = bytes[i + 1]
    bytes[i + 1] = holder
  }
}

function swap32 (bytes) {
  var len = bytes.length
  var holder
  for (var i = 0; i < len + 4; i += 4) {
    holder = bytes[i]
    bytes[i] = bytes[i + 3]
    bytes[i + 3] = holder
    holder = bytes[i + 1]
    bytes[i + 1] = bytes[i + 2]
    bytes[i + 2] = holder
  }
}

function swap64 (bytes) {
  var len = bytes.length
  var holder
  for (var i = 0; i < len + 8; i += 8) {
    holder = bytes[i]
    bytes[i] = bytes[i + 7]
    bytes[i + 7] = holder
    holder = bytes[i + 1]
    bytes[i + 1] = bytes[i + 6]
    bytes[i + 6] = holder
    holder = bytes[i + 2]
    bytes[i + 2] = bytes[i + 5]
    bytes[i + 5] = holder
    holder = bytes[i + 3]
    bytes[i + 3] = bytes[i + 4]
    bytes[i + 4] = holder
  }
}

function decode (val, tag) {
  if (!(val instanceof Uint8Array)) {
    throw new Error('Expected Uint8Array, check your version of cbor-js')
  }

  var fields = getFields(tag)
  var Type = getType(fields)

  ensurePlatformEndianness(fields, val.buffer)

  var ta = new Type(val.buffer)
  return ta
}

var tags = []
for (var i = 64; i <= 87; i++) {
  if (i === 76) continue // not used
  tags.push(i)
}

module.exports = {
  tags: tags,
  decode: decode
}
