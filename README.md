# cryptii

[![Build Status](https://travis-ci.org/cryptii/cryptii.svg?branch=dev)](https://travis-ci.org/cryptii/cryptii)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.md)

Web app and framework offering modular conversion, encoding and encryption. Translations are done client side without any server interaction — [cryptii.com](https://cryptii.com)

## Getting started

- Install the [node](https://nodejs.org/) version specified in `.nvmrc`.
- Clone the repository: `git clone git@github.com:cryptii/cryptii.git`
- Install dependencies: `npm install`
- Build into the `dist/` folder: `npm run-script build`
- Test source code: `npm run-script test`
- Watch files: `npm run-script watch`

## Concepts

This framework and web app tries to reflect a wide variety of ciphers, formats, algorithms and methods (called 'bricks') while keeping them easily combinable. There are two categories of bricks: encoders and viewers.

### Encoders

Encoders manipulate content by encoding or decoding it in a specific way and settings.

| Name | Category | Description |
| ---- | -------- | ----------- |
| `text-transform` | Transform | Transforming character case and arrangement |
| `numeral-system` | Transform | Translates numerals between systems |
| `bitwise-operation` | Transform | [Bitwise operations](https://en.wikipedia.org/wiki/Bitwise_operation) (NOT, AND, OR, …) |
| `morse-code` | Alphabets | [Morse code](https://en.wikipedia.org/wiki/Morse_code) (English) |
| `spelling-alphabet` | Alphabets | Several [spelling alphabets](https://en.wikipedia.org/wiki/Spelling_alphabet) |
| `rot13` | Simple Substitution | [ROT13](https://en.wikipedia.org/wiki/ROT13) incl. variants ROT5, ROT18 & ROT47 |
| `affine-cipher` | Simple Substitution | [Affine Cipher](https://en.wikipedia.org/wiki/Affine_cipher) |
| `caesar-cipher` | Simple Substitution | [Caesar cipher](https://en.wikipedia.org/wiki/Caesar_cipher) |
| `atbash` | Simple Substitution | [Atbash](https://en.wikipedia.org/wiki/Atbash) using latin or hebrew alphabet |
| `vigenere-cipher` | Simple Substitution | [Vigenère cipher](https://en.wikipedia.org/wiki/Vigen%C3%A8re_cipher) incl. [Beaufort cipher](https://en.wikipedia.org/wiki/Beaufort_cipher) variants |
| `enigma` | Simple Substitution | [Enigma machine](https://en.wikipedia.org/wiki/Enigma_machine) incl. 13 models |
| `base64` | Encoding | [Base64](https://en.wikipedia.org/wiki/Base64) incl. variants base64url, … |
| `ascii85` | Encoding | [Ascii85 / Base85](https://en.wikipedia.org/wiki/Ascii85) incl. variant [Z85](https://rfc.zeromq.org/spec:32/Z85/) |
| `unicode-code-points` | Encoding | Encoding to Unicode code points in given format |
| `url-encoding` | Encoding | [URL encoding / Percent-encoding](https://en.wikipedia.org/wiki/Percent-encoding) |
| `integer` | Encoding | Translates between bytes and [integers](https://en.wikipedia.org/wiki/Integer_(computer_science)) |
| `block-cipher` | Modern cryptography | [Block ciphers](https://en.wikipedia.org/wiki/Block_cipher) incl. [AES](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) |
| `hash` | Modern cryptography | Creating a [message digest](https://en.wikipedia.org/wiki/Cryptographic_hash_function) |
| `hmac` | Modern cryptography | Creating a [Hash-based message authentication code](https://en.wikipedia.org/wiki/Hash-based_message_authentication_code) |

Example usage in code:

```javascript
let encoder = new ROT13Encoder()
encoder.setSettingValue('variant', 'rot47')
let result = encoder.encode('Hello World') // returns a Chain object
result.getString() // returns 'w6==@ (@C=5'
```

### Viewers

Viewers allow users to view and edit content in a specific way or format.

| Name | Category | Description |
| ---- | -------- | ----------- |
| `text` | View | Viewing and editing in plain text |
| `bytes` | View | Viewing and editing bytes |

### Chains

Chain objects encapsulate the actual content used and returned by encoders and viewers. This content can either be a string, an array of Unicode code points or a `Uint8Array` of bytes.

Chains are immutable. You define its content by passing one of these representations as first argument to the constructor.

```javascript
const a = new Chain('🦊🚀')
const b = new Chain([129418, 128640])
const c = new Chain(new Uint8Array([240, 159, 166, 138, 240, 159, 154, 128]))
Chain.isEqual(a, b, c) // returns true
```

The object handles the translation between these representations lazily for you. You can access any of these through getter and additional convenience methods.

```javascript
const string = chain.getString()
const codePoints = chain.getCodePoints()
const bytes = chain.getBytes()
```
