
const QRCode = require('easyqrcodejs')
const bip39 = require("bip39")
const HDWallet = require('ethereum-hdwallet')
const ethWallet = require('ethereumjs-wallet')
const { dnaUrlDecode, dnaUrlEncode } = require('dnaurl/src/dnaurl.js')

// TODO: have a proper dnawallet object with a coherent interface.
const keccak256 = require("keccak256");  // already a dep of ethereum-hdwallet
const { ecsign } = require('ethereumjs-util');
const RLP = require('rlp');  // already a dep of ethereum-hdwallet

//require('default-passive-events');

import logo from './img/dna_80x80b.png'
import logo2 from './img/dna_80x80c.png'
import idena512 from './img/pdna512.png'


var privateKey = null
var address

// TODO: factorize!!!
function getQRConfig(text, logo) {
    return { text: text, // Content
						width: 240, // Width
						height: 240, // Height
						colorDark: "#0051ff",
						colorLight: "#ffffff", // Light color
                        PO: '#009fff', // Global Position Outer color. if not set, the defaut is `colorDark`
						PI: '#00d2ff',
						quietZone: 0,
						logo: logo, // LOGO
						logoBackgroundTransparent: true, // Whether use transparent image, default is false
						backgroundImage: idena512,
						backgroundImageAlpha: 0.3,
						autoColor: false,
						correctLevel: QRCode.CorrectLevel.M // L, M, Q, H - don't use L, not enough dup info to allow for the logo
						}}

function getQRConfig2(text, logo) {
    return { text: text, // Content
						width: 240, // Width
						height: 240, // Height
						colorDark: "#0051ff",
						colorLight: "#ffffff", // Light color
                        PO: '#a70000', // Global Position Outer color. if not set, the defaut is `colorDark`
						PI: '#ff0000',
						quietZone: 0,
						logo: logo, // LOGO
						logoBackgroundTransparent: true, // Whether use transparent image, default is false
						backgroundImage: idena512,
						backgroundImageAlpha: 0.3,
						autoColor: false,
						correctLevel: QRCode.CorrectLevel.M // L, M, Q, H - don't use L, not enough dup info to allow for the logo
						}}


function type_changed() {
    const select_elem = document.querySelector("#code-type")
    if (select_elem.value=="Paper") {
        document.querySelector("#hd-index-option").style.display = "none";
    } else {
        document.querySelector("#hd-index-option").style.display = "block";
    }
    //console.log(select_elem.value)
}

function sign_tx(e) {
    const transaction = dnaUrlDecode(document.querySelector("#dna-url").value)
    //console.log(transaction)
    if (transaction["status"] == "OK") {
      document.querySelector("#output").innerHTML = "ok";
      const rlpData = RLP.encode(transaction["raw"]);
      //console.log(rlpData.toString('hex'));
      //expect(rlpData.toString('hex')).toBe("de0129809402bd24ad70c2335f5b3fe47bfce8ed6e39d447cb018227108080")
      const hash = keccak256(rlpData); // Buffer
      //console.log(hash.toString('hex'));
      //expect(hash.toString('hex')).toBe("df19875a7f76deb535fc2bce4fc4536270ed9c3a1f422e1c0950234bac7ddcdc")
      const sig2 = ecsign(hash, privateKey)
      //console.log(sig2)
      const joinedSignature = Buffer.concat([sig2.r, sig2.s, Buffer.from([sig.v - 27])]);
      //console.log(joinedSignature.toString('hex'))
      // expect(joinedSignature.toString('hex')).toBe("df3a8b3ed0801452f051cc8f28cefbe80d6fe7d26a09803ff5b7a3c0d42440a70d5bdb718eb12c627708af81af08607fe01ae63a4732880cf0dbe75175007ce001")
      const sigTransaction = {
        "txid": document.querySelector("#dna-url").value.split("/").slice(-1), // encoded checksum of tx to sign
        "signature": joinedSignature.toString('hex') // hex
      };
      const sigUrl = dnaUrlEncode(sigTransaction, "sig")
      //console.log(sigurl)
      document.querySelector("#output").innerHTML = '<b>Your Sig Dna Url: <input type="TEXT" class="form-control" id="dna-sig-url" autocomplete="off" data-docs-version="4.3" value="'+sigUrl+'"></b>';
    } else {
        document.querySelector("#output").innerHTML = "<b>Error:"+transaction["message"]+"</b>";
    }
}


function generate_tx(e) {
    document.body.style.cursor = 'progress';
    const select_elem = document.querySelector("#code-type")
    const words = document.querySelector("#word-input").value
    if (select_elem.value=="Paper") {
        privateKey = Buffer.from(bip39.mnemonicToEntropy(words), 'hex')
        console.log(privateKey)
        address = ethWallet.fromPrivateKey(Buffer.from(privateKey, 'hex')).getAddressString()
    } else {
        const hdwallet = HDWallet.fromMnemonic(words)
        const eth = document.querySelector("#eth").checked
        let mywallet
        let path = ''
        if (eth) {
            mywallet = hdwallet.derive(`m/44'/60'/0'/0`)
        } else {
            mywallet = hdwallet.derive(`m/44'/515'/0'/0`)
        }
        const i = document.querySelector("#hd-index").value
        const derived = mywallet.derive(i)
        if (eth) {
            path = `m/44'/60'/0'/0/`+i.toString()
        } else {
            path = `m/44'/515'/0'/0/`+i.toString()
        }
        address = `0x${derived.getAddress().toString('hex')}`
        privateKey = derived.getPrivateKey()
    }
    // Now decode dnaurl
    const transaction = dnaUrlDecode(document.querySelector("#dna-url").value)
    console.log(transaction)
    if (transaction["status"] == "OK") {
        document.querySelector("#tx-to").innerHTML = transaction["recipient"];
        document.querySelector("#tx-amount").innerHTML = Number.parseFloat(transaction["amount"]/1e18).toFixed(18);
        document.querySelector("#tx-data").innerHTML = transaction["data"];

        document.querySelector("#my-address").innerHTML = address;
        document.querySelector("#tx-error-details").style.display = "none";
        document.querySelector("#tx-details").style.display = "block";
        document.querySelector("#sign_tx").style.display = "block";
    } else {
        document.querySelector("#tx-error-details").style.display = "block";
        document.querySelector("#tx-details").style.display = "block";
        document.querySelector("#sign_tx").style.display = "none";
        document.querySelector("#tx-error-details").innerHTML = "<b>Error:"+transaction["message"]+"</b>";
    }
    document.body.style.cursor = 'default';
}

document.querySelector("#generate_tx").addEventListener("click", generate_tx)
document.querySelector("#code-type").addEventListener("change", type_changed)
document.querySelector("#sign_tx").addEventListener("click", sign_tx)
type_changed()
