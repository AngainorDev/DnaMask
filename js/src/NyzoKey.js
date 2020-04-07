
//const { sign, box, secretbox, randomBytes } = require('tweetnacl')
const { sign } = require('tweetnacl')
const createHash = require('create-hash')
const createHmac = require('create-hmac')
// const { decodeUTF8, encodeUTF8, encodeBase64, decodeBase64 } = require("tweetnacl-util")

const bip39 = require('bip39');
// const crypto = require("crypto");

const { NyzoFormat } = require('./NyzoFormat')
nyzoFormat = new NyzoFormat()

const { NyzoStringPublicIdentifier } = require("nyzostrings/src/NyzoStringPublicIdentifier.js")
const { NyzoStringPrivateSeed } = require("nyzostrings/src/NyzoStringPrivateSeed.js")
const { nyzoStringEncoder } = require("nyzostrings/src/NyzoStringEncoder.js")

const DEFAULT_PASSWORD = 'NYZO_ROCKS!'

// SLIP-0010
const CURVE_KEY = 'ed25519 seed'

// ed25519 only uses hardened childs
const HARDENED_OFFSET = 0x80000000;

function nyzoSeedToHexString(nyzoSeed) {
  return nyzoSeed.split('-').join('').slice(0, 64)
}


function NyzoKey(nyzoSeed) {
  if (nyzoSeed) {
    this.seed = Buffer.from(nyzoSeedToHexString(nyzoSeed), 'hex')
    this.keyPair = sign.keyPair.fromSeed(this.seed)
  } else {
    this.seed = null
    this.keyPair = null
  }
  this.chainCode = null
}


NyzoKey.prototype.toSeedHex = function() {
    return nyzoFormat.hexStringFromArray(this.seed)
}


NyzoKey.prototype.toNyzoPrivateSeed = function() {
    const stringObject = new NyzoStringPrivateSeed(this.seed)
    const string = nyzoStringEncoder.encode(stringObject)
    return string
}


NyzoKey.prototype.toNyzoPublicIdentifier = function() {
    const stringObject = new NyzoStringPublicIdentifier(this.keyPair.publicKey)
    const string = nyzoStringEncoder.encode(stringObject)
    return string
}


NyzoKey.prototype.toSeedHexWithDashes = function() {
    return nyzoFormat.hexStringFromArrayWithDashes(this.seed)
}


NyzoKey.prototype.fromBIP39 = function (passPhrase, password='') {
    // HD Wallet from BIP39 - Uses seed and chainCode for derivation
    if (password == '') password = DEFAULT_PASSWORD
    const seed512 = bip39.mnemonicToSeedSync(passPhrase, password)  // This is a buffer
    const I = createHmac('sha512', Buffer.from(CURVE_KEY)).update(seed512).digest()
    this.seed = I.slice(0, 32)
    this.chainCode = I.slice(32)
    this.keyPair = sign.keyPair.fromSeed(this.seed)
    return this
}


NyzoKey.prototype.fromSLIP10Seed = function (seed512Hex) {
    // HD Wallet from BIP39 - Uses hexseed to match official test vectors
    const seed512 = Buffer.from(seed512Hex.slice(0, 128), 'hex')
    const I = createHmac('sha512', Buffer.from(CURVE_KEY)).update(seed512).digest()
    this.seed = I.slice(0, 32)
    this.chainCode = I.slice(32)
    this.keyPair = sign.keyPair.fromSeed(this.seed)
    return this
}


NyzoKey.prototype.derive = function (index, hardened=true) {
    // Returns derived key at index
    if (hardened) index += HARDENED_OFFSET  // Harden by default, because ed25519
    if (index < HARDENED_OFFSET) throw new Error('Invalid derivation index');
    const indexBuffer = Buffer.allocUnsafe(4)
    indexBuffer.writeUInt32BE(index, 0)
    // key = Buffer.from(this.toSeedHex, 'hex')
    const data = Buffer.concat([Buffer.alloc(1, 0), this.seed, indexBuffer])
    const I = createHmac('sha512', Buffer.from(this.chainCode)).update(data).digest()
    const IL = I.slice(0, 32)
    const IR = I.slice(32)
    derived = new NyzoKey()
    derived.seed = IL
    derived.keyPair = sign.keyPair.fromSeed(derived.seed)
    derived.chainCode = IR
    return derived
}


NyzoKey.prototype.fromPaperCode = function (passPhrase) {
    // Unique address from paper wallet, no chaincode
    this.seed = Buffer.from(bip39.mnemonicToEntropy(passPhrase), 'hex')
    this.keyPair = sign.keyPair.fromSeed(this.seed)
    this.chainCode = null
    return this
}


NyzoKey.prototype.toPaperCode = function () {
    // Mnemonic from seed, no chain code: unique address
    return bip39.entropyToMnemonic(this.toSeedHex())
}


NyzoKey.prototype.toPubKey = function () {
    return this.keyPair.publicKey
}


NyzoKey.prototype.toPubKeyHex = function () {
    return Buffer.from(this.keyPair.publicKey).toString('hex')
}


NyzoKey.prototype.toPubKeyHexWithDashes = function () {
    return nyzoFormat.hexStringFromArrayWithDashes(this.keyPair.publicKey, 0, 32)
}


NyzoKey.prototype.toPrivKeyHex = function () {
    return Buffer.from(this.keyPair.secretKey).toString('hex')
}


NyzoKey.prototype.toPrivKeyHexWithDashes = function () {
    return nyzoFormat.hexStringFromArrayWithDashes(this.keyPair.secretKey, 0, 64)
}


NyzoKey.prototype.toChainCodeHex = function () {
    return this.chainCode.toString('hex')
}


NyzoKey.prototype.LegacyPubKeyToNyzoString = function (legacyHex) {
    const nyzoString = NyzoStringPublicIdentifier.fromHex(legacyHex)
    return nyzoStringEncoder.encode(nyzoString)
}


NyzoKey.prototype.NyzoStringToLegacy = function (nyzoString) {
    const keyObject = nyzoStringEncoder.decode(nyzoString)
    if (keyObject == null) {
		return(['Error', 'Not a nyzoString private or public key!'])
	}
	if (keyObject.constructor == NyzoStringPublicIdentifier) {
		return(['Public Id', nyzoFormat.hexStringFromArrayWithDashes(keyObject.getIdentifier(), 0, 32)])
	}
	else if (keyObject.constructor == NyzoStringPrivateSeed) {
		return(['Private Key', nyzoFormat.hexStringFromArrayWithDashes(keyObject.getSeed(), 0, 32)])
	}
	else {
		return(['Error', 'Not a nyzoString private or public key!'])
	}
}


module.exports = {
    version: "0.0.7",
    NyzoKey
}
