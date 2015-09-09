# cborjs-typedarray-decoder [![Build Status](https://travis-ci.org/Reading-eScience-Centre/cborjs-typedarray-decoder.svg)](https://travis-ci.org/Reading-eScience-Centre/cborjs-typedarray-decoder)

A [cbor-js](https://github.com/paroga/cbor-js) decoder for [CBOR typed arrays](https://tools.ietf.org/html/draft-jroatch-cbor-tags-02).

This is a work-in-progress and not battle-tested yet.
It currently cannot be used in cbor-js due to an outstanding [issue](https://github.com/Reading-eScience-Centre/cborjs-typedarray-decoder/issues/1).

## Example

TBD

## How does it work?

Numeric typed arrays in CBOR can be encoded by using tags as defined in the soon-to-be-RFC [draft-jroatch-cbor-tags-02](https://tools.ietf.org/html/draft-jroatch-cbor-tags-02). Compared to standard arrays, they use less space (1 byte less per array element) and are faster to decode.

This decoder wraps CBOR typed arrays directly as [JavaScript typed arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays). By providing a view on top of the underlying ArrayBuffer supplied by cbor-js it makes parsing very efficient.

In the unlikely case that the platform endianness where the decoder is running does not match the one used when encoding, a fast byte swapping on the original array data is done using optimized for-loops for each bit length.

## Supported types

CBOR typed arrays currently support more data types than in JavaScript. Only the ones existing in JavaScript are supported, which are currently:

- Int8Array
- Uint8Array
- Uint8ClampedArray
- Int16Array
- Uint16Array
- Int32Array
- Uint32Array
- Float32Array
- Float64Array