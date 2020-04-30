// This is what DnaMask requires
const RLP = require('rlp');  // already a dep of ethereum-hdwallet
const HDWallet = require('ethereum-hdwallet');
const keccak256 = require("keccak256");  // already a dep of ethereum-hdwallet
const { ecsign } = require('ethereumjs-util');

// This is to compare to the official snippet, needed for test (hence dev) but not for dist.
const ethers = require('ethers');
const { SigningKey } = require('ethers/utils/signing-key');


describe("DNA Reference", () => {
    // Official reference from https://github.com/idena-network/idena-go/issues/359#issuecomment-610272091
    test("Assemble and sign a transaction", () => {
      const data = [
        1, // nonce
        41, // epoch
        0, // type
        '0x02bD24aD70C2335F5B3FE47bfcE8eD6e39D447CB', // to
        1, // amount (0.000000000000000001)
        10000, // max fee (0.000000000000010000)
        null, // tips
        '0x', // payload (can be null too)
      ];
      const rlpData = RLP.encode(data);
      expect(rlpData.toString('hex')).toBe("de0129809402bd24ad70c2335f5b3fe47bfce8ed6e39d447cb018227108080")
      const hash = ethers.utils.keccak256(rlpData); // int
      // console.log(hash);
      expect(hash.toString('hex')).toBe("0xdf19875a7f76deb535fc2bce4fc4536270ed9c3a1f422e1c0950234bac7ddcdc")
      // Vector 0, Wallet 0, eth code 60
      const key = new SigningKey("1ab42cc412b618bdea3a599e3c9bae199ebf030895b039e9db1e30dafb12b727");
      expect(key.address).toBe("0x9858EfFD232B4033E47d90003D41EC34EcaEda94")

      const sig = key.signDigest(hash);
      expect(sig.r).toBe("0xdf3a8b3ed0801452f051cc8f28cefbe80d6fe7d26a09803ff5b7a3c0d42440a7")
      expect(sig.s).toBe("0x0d5bdb718eb12c627708af81af08607fe01ae63a4732880cf0dbe75175007ce0")
      //console.log(sig)
      const joinedSignature = Buffer.concat([
        Buffer.from(sig.r.substr(2), 'hex'),
        Buffer.from(sig.s.substr(2), 'hex'),
        Buffer.from([sig.recoveryParam]),  // And not 0, see https://github.com/idena-network/idena-go/issues/359#issuecomment-611418937
      ]);
      //expect(joinedSignature.toString('hex')).toBe("df3a8b3ed0801452f051cc8f28cefbe80d6fe7d26a09803ff5b7a3c0d42440a70d5bdb718eb12c627708af81af08607fe01ae63a4732880cf0dbe75175007ce000")
      expect(joinedSignature.toString('hex')).toBe("df3a8b3ed0801452f051cc8f28cefbe80d6fe7d26a09803ff5b7a3c0d42440a70d5bdb718eb12c627708af81af08607fe01ae63a4732880cf0dbe75175007ce001")
      const res = [...data, joinedSignature];
      const rlpResult = RLP.encode(res);
      //expect(rlpResult.toString('hex')).toBe("f8610129809402bd24ad70c2335f5b3fe47bfce8ed6e39d447cb018227108080b841df3a8b3ed0801452f051cc8f28cefbe80d6fe7d26a09803ff5b7a3c0d42440a70d5bdb718eb12c627708af81af08607fe01ae63a4732880cf0dbe75175007ce000")
      expect(rlpResult.toString('hex')).toBe("f8610129809402bd24ad70c2335f5b3fe47bfce8ed6e39d447cb018227108080b841df3a8b3ed0801452f051cc8f28cefbe80d6fe7d26a09803ff5b7a3c0d42440a70d5bdb718eb12c627708af81af08607fe01ae63a4732880cf0dbe75175007ce001")
    })
})

describe("DNA Mask", () => {
    // our signing
    test("Assemble and sign a transaction", () => {
      const data = [
        1, // nonce
        41, // epoch
        0, // type
        '0x02bD24aD70C2335F5B3FE47bfcE8eD6e39D447CB', // to
        1, // amount (0.000000000000000001)
        10000, // max fee (0.000000000000010000)
        null, // tips
        '0x', // payload (can be null too)
      ];
      const rlpData = RLP.encode(data);
      expect(rlpData.toString('hex')).toBe("de0129809402bd24ad70c2335f5b3fe47bfce8ed6e39d447cb018227108080")
      const hash = keccak256(rlpData); // Buffer
      //console.log(hash);
      expect(hash.toString('hex')).toBe("df19875a7f76deb535fc2bce4fc4536270ed9c3a1f422e1c0950234bac7ddcdc")

      const hdwallet = HDWallet.fromMnemonic("abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about")
      const mywallet = hdwallet.derive(`m/44'/60'/0'/0`)
      const derived0 = mywallet.derive(0)
      expect(derived0.getAddress().toString('hex')).toBe("9858effd232b4033e47d90003d41ec34ecaeda94")
      const sig2 = ecsign(hash, derived0.getPrivateKey())
      console.log(sig2)
      const joinedSignature = Buffer.concat([sig2.r, sig2.s, Buffer.from([sig2.v - 27])]);
      expect(joinedSignature.toString('hex')).toBe("df3a8b3ed0801452f051cc8f28cefbe80d6fe7d26a09803ff5b7a3c0d42440a70d5bdb718eb12c627708af81af08607fe01ae63a4732880cf0dbe75175007ce001")
      const res = [...data, joinedSignature];
      const rlpResult = RLP.encode(res);
      expect(rlpResult.toString('hex')).toBe("f8610129809402bd24ad70c2335f5b3fe47bfce8ed6e39d447cb018227108080b841df3a8b3ed0801452f051cc8f28cefbe80d6fe7d26a09803ff5b7a3c0d42440a70d5bdb718eb12c627708af81af08607fe01ae63a4732880cf0dbe75175007ce001")

    })
})
