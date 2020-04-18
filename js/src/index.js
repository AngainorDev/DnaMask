console.log("Hello DNA!")

const bip39 = require("bip39")
const QRCode = require('easyqrcodejs')
const HDWallet = require('ethereum-hdwallet')

import logo from './img/dna_80x80b.png'
import idena512 from './img/pdna512.png'


function generate_mnemonic(bits=128) {
  const mnemonic = bip39.generateMnemonic(bits)
  const element = document.querySelector("#BIP39-input")
  element.value = mnemonic
}


function generate_mnemonic12() {
    generate_mnemonic(128)
}


function generate_mnemonic24() {
    generate_mnemonic(256)
}


function getKeyRowWithQR(index, path, privateKey, publicKey, address, paperCode, tHeadClass='') {
    return  `
        <div class="col-12">
          <table class="table" style="border: 1px solid #aaa;">
          <thead class="${tHeadClass}">
            <tr>
              <th>Keys</th><th>Values (Address ${index} - derive path ${path})</th><th>Address QR Code</th>
            </tr>
          </thead>
            <tr>
              <td>Address</td><td>${address}</td><td rowspan="3"  style="text-align:center; vertical-align:center"><div class="qr" id="qrcode_${index}"></div></td>
            </tr>
            <tr>
              <td>Private key<br/>(nodekey)</td><td>${privateKey}</td>
            </tr>
            <tr>
              <td>Public key</td><td><textarea class="form-control" >${publicKey}</textarea></td>
            </tr>
            <tr>
               <td colspan="3">paperCode ${index}: <textarea class="form-control" >${paperCode}</textarea>
               </td>
            </tr>
          </table>
        </div>
    `
}

function getKeyRowWithQRAndRobot(index, path, privateKey, publicKey, address, paperCode, tHeadClass='') {
    return  `
        <div class="col-12">
          <table class="table" style="border: 1px solid #aaa;">
          <thead class="${tHeadClass}">
            <tr>
              <th>Robot</th><th>Keys</th><th>Values (Address ${index} - derive path ${path})</th><th>Address QR Code</th>
            </tr>
          </thead>
            <tr>
              <td rowspan="3" style="text-align:center; vertical-align:center"><img src="https://robohash.org/${address}" style="margin:0; padding:0;width:235px; height:235px;"/></td><td>Address</td><td>${address}</td><td rowspan="3" style="text-align:center; vertical-align:center"><div class="qr" id="qrcode_${index}"></div></td>
            </tr>
            <tr>
              <td>Private key<br/>(nodekey)</td><td>${privateKey}</td>
            </tr>
            <tr>
              <td>Public key</td><td><textarea class="form-control" >${publicKey}</textarea></td>
            </tr>
            <tr>
               <td colspan="4">paperCode ${index} <textarea class="form-control" >${paperCode}</textarea></td>
            </tr>
          </table>
        </div>
    `
}



function generate_addresses() {
    const mnemonic = document.querySelector("#BIP39-input").value.trim()
    //const MasterKey = new NyzoKey().fromBIP39(mnemonic)
    const hdwallet = HDWallet.fromMnemonic(mnemonic)
    const count = parseInt(document.querySelector("#BIP39-count").value, 10)
    const wrapper = document.querySelector("#addresses")
    let content = ''
    let extraClass=''
    let ids = []
    let i = 0
    const eth = document.querySelector("#eth").checked
    const robot = document.querySelector("#robot").checked
    let mywallet
    let path = ''
    if (eth) {
        mywallet = hdwallet.derive(`m/44'/60'/0'/0`)
    } else {
        mywallet = hdwallet.derive(`m/44'/515'/0'/0`)
    }
    for (i=0; i<count; i++) {
        //derived = MasterKey.derive(i)
        const derived = mywallet.derive(i)
        if (eth) {
            path = `m/44'/60'/0'/0/`+i.toString()
        } else {
            path = `m/44'/515'/0'/0/`+i.toString()
        }
        const papercode = bip39.entropyToMnemonic(derived.getPrivateKey().toString('hex'))
        if (robot) {
            content += getKeyRowWithQRAndRobot(i, path, derived.getPrivateKey().toString('hex'),
                                 derived.getPublicKey().toString('hex'), `0x${derived.getAddress().toString('hex')}`,
                                 papercode, extraClass)
        } else {
            content += getKeyRowWithQR(i, path, derived.getPrivateKey().toString('hex'),
                                 derived.getPublicKey().toString('hex'), `0x${derived.getAddress().toString('hex')}`,
                                 papercode, extraClass)

        }
        ids.push('0x'+derived.getAddress().toString('hex'))
        if (extraClass =='') {extraClass = 'thead-light'} else {extraClass = ''}
    }
    wrapper.innerHTML = content
    // https://www.color-hex.com/color-palette/9753
    let config = { text: "", // Content
						width: 240, // Width
						height: 240, // Height
						//colorDark: "#630900", // Dark color
						//colorDark: "#000000", // Dark color
						colorDark: "#0051ff",
						colorLight: "#ffffff", // Light color

						//PO: '#630900', // Global Position Outer color. if not set, the defaut is `colorDark`
						//PI: '#630900',
						PO: '#009fff', // Global Position Outer color. if not set, the defaut is `colorDark`
						PI: '#00d2ff',


						quietZone: 0,
						// === Logo
						logo: logo, // LOGO
						//					logo:"http://127.0.0.1:8020/easy-qrcodejs/demo/logo.png",
						//					logoWidth:80,
						//					logoHeight:80,
						//logoBackgroundColor: '#ffffff', // Logo background color, Invalid when `logBgTransparent` is true; default is '#ffffff'
						logoBackgroundTransparent: true, // Whether use transparent image, default is false
						backgroundImage: idena512,
						backgroundImageAlpha: 1,
						autoColor: false,
						correctLevel: QRCode.CorrectLevel.M // L, M, Q, H - don't use L, not enough dup info to allow for the logo
						}
    for (i=1; i<=count; i++) {
        config.text = ids[i-1]
        let t = new QRCode(document.getElementById("qrcode_" + i), config)
    }
}

document.querySelector("#generate_mnemonic12").addEventListener("click", generate_mnemonic12)
document.querySelector("#generate_mnemonic24").addEventListener("click", generate_mnemonic24)
document.querySelector("#generate_addresses").addEventListener("click", generate_addresses)
