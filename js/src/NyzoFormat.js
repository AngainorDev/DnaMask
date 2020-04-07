// const { sign, box, secretbox, randomBytes } = require("tweetnacl")

// const { decodeUTF8, encodeUTF8, encodeBase64, decodeBase64 } = require("tweetnacl-util")

function NyzoFormat() {
}


NyzoFormat.prototype.hexStringToByteArray = function (value) {
    // From nyzo.co website, so to keep compatibility
    var firstCharacterValue = -1
    var byteArray = new Uint8Array(32)
    var byteArrayIndex = 0
    for (var i = 0; i < value.length && byteArrayIndex < 32; i++) {
        var character = value.charAt(i)
        var characterValue = parseInt(character, 16)
        if (!isNaN(characterValue)) {
            if (firstCharacterValue < 0) {
                firstCharacterValue = characterValue
            } else {
                byteArray[byteArrayIndex] = firstCharacterValue * 16 + characterValue
                firstCharacterValue = -1
                byteArrayIndex++
            }
        }
    }
    return byteArray
}


NyzoFormat.prototype.hexStringFromArrayWithDashes = function (byteArray, index=0, length=32) {
    var result = ''
    var dashCount = 0
    for (var i = index; i < index + length && i < byteArray.length; i++) {
        var byteString = byteArray[i].toString(16)
        while (byteString.length < 2) {
            byteString = '0' + byteString
        }
        result += byteString
        dashCount++
        if (dashCount == 8 && i < index + length - 1) {
            result += '-'
            dashCount = 0
        }
    }
    return result
}


NyzoFormat.prototype.hexStringFromArray = function(byteArray, index=0, length=32) {
    var result = ''
    for (var i = index; i < index + length && i < byteArray.length; i++) {
        var byteString = byteArray[i].toString(16)
        while (byteString.length < 2) {
            byteString = '0' + byteString
        }
        result += byteString
    }
    return result
}


NyzoFormat.prototype.nyzoSeedToHexString = function(nyzoSeed) {
  return nyzoSeed.split('-').join('').slice(0, 64)
}


NyzoFormat.prototype.hexStringToByteArray2 = function(nyzoSeed) {
    return Buffer.from(this.nyzoSeedToHexString(nyzoSeed), 'hex')
}


/*

// From nyzo.co

function intValueFromArray(byteArray, index, length) {

var timestamp = 0;
for (var i = index; i < index + length; i++) {
timestamp *= 256;
timestamp += byteArray[i];
}

return timestamp;
}



function arrayFromArray(byteArray, index, length) {

var result = new Uint8Array(length);
for (var i = 0; i < length; i++) {
result[i] = byteArray[index + i];
}

return result;
}

function hexStringFromArray(byteArray, index, length) {

var result = '';
for (var i = index; i < index + length && i < byteArray.length; i++) {
var byteString = byteArray[i].toString(16);
while (byteString.length < 2) {
byteString = '0' + byteString;
}
result += byteString;
}

return result;
}


function stringFromArray(byteArray, index) {

var length = byteArray[index] * 256 + byteArray[index + 1];
return stringFromArrayWithLength(byteArray, index + 2, length);
}

function stringFromArrayWithLength(byteArray, index, length) {

var arrayCopy = new Uint8Array(length);
for (var i = 0; i < length; i++) {
arrayCopy[i] = byteArray[i + index];
}

var encodedString = String.fromCharCode.apply(null, arrayCopy);
return decodeURIComponent(escape(encodedString));
}

function hexStringAsUint8Array(identifier) {

identifier = identifier.split('-').join('');
console.log('identifier after split/join is ' + identifier);

var array = new Uint8Array(identifier.length / 2);
for (var i = 0; i < array.length; i++) {
array[i] = parseInt(identifier.substring(i * 2, i * 2 + 2), 16);
}

return array;
}

function sha256Uint8(array) {
var ascii = '';
for (var i = 0; i < array.length; i++) {
ascii += String.fromCharCode(array[i]);
}

return hexStringAsUint8Array(sha256(ascii));
}

function doubleSha256(array) {

return sha256Uint8(sha256Uint8(array));
}

function stringAsUint8Array(string) {

var encodedString = unescape(encodeURIComponent(string));

var array = new Uint8Array(encodedString.length);
for (var i = 0; i < encodedString.length; i++) {
array[i] = encodedString.charCodeAt(i);
}

return array;
}


*/

module.exports = {
    version: "0.0.1",
    NyzoFormat
}
