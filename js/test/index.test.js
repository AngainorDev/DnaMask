const bip39 = require("bip39")
const HDWallet = require('ethereum-hdwallet')

describe("BIP39 Tests", () => {
  // https://github.com/trezor/python-mnemonic/blob/master/vectors.json
  test("Convert mnemonic0 to entropy", () => {
    const entropy = bip39.mnemonicToEntropy("abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about")
    expect(entropy).toBe("00000000000000000000000000000000")
  })
  test("Convert mnemonic1 to entropy", () => {
    const entropy = bip39.mnemonicToEntropy("legal winner thank year wave sausage worth useful legal winner thank yellow")
    expect(entropy).toBe("7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f")
  })

  test("Convert mnemonic6 to entropy", () => {
    const entropy = bip39.mnemonicToEntropy("letter advice cage absurd amount doctor acoustic avoid letter advice cage absurd amount doctor acoustic avoid letter always")
    expect(entropy).toBe("808080808080808080808080808080808080808080808080")
  })

  test("Convert mnemonic12 to entropy", () => {
    const entropy = bip39.mnemonicToEntropy("ozone drill grab fiber curtain grace pudding thank cruise elder eight picnic")
    expect(entropy).toBe("9e885d952ad362caeb4efe34a8e91bd2")
  })

  test("Convert mnemonic to entropy", () => {
    const entropy = bip39.mnemonicToEntropy("void come effort suffer camp survey warrior heavy shoot primary clutch crush open amazing screen patrol group space point ten exist slush involve unfold")
    expect(entropy).toBe("f585c11aec520db57dd353c69554b21a89b20fb0650966fa0a9d6f74fd989d8f")
  })
})


describe("Derive Tests Code 60 - ETH", () => {
  // Eth chain code slip44
  test("Derive mnemonic0 wallet", () => {
    const hdwallet = HDWallet.fromMnemonic("abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about")
    const mywallet = hdwallet.derive(`m/44'/60'/0'/0`)
    const derived0 = mywallet.derive(0)
    expect(derived0.getPrivateKey().toString('hex')).toBe("1ab42cc412b618bdea3a599e3c9bae199ebf030895b039e9db1e30dafb12b727")
    expect(derived0.getPublicKey().toString('hex')).toBe("37b0bb7a8288d38ed49a524b5dc98cff3eb5ca824c9f9dc0dfdb3d9cd600f299a6179912b7451c09896c4098eca7ce6b2e58330672795e847c4d6af44e024230")
    expect(derived0.getAddress().toString('hex')).toBe("9858effd232b4033e47d90003d41ec34ecaeda94")
    const derived1 = mywallet.derive(1)
    expect(derived1.getPrivateKey().toString('hex')).toBe("9a983cb3d832fbde5ab49d692b7a8bf5b5d232479c99333d0fc8e1d21f1b55b6")
    expect(derived1.getPublicKey().toString('hex')).toBe("9fd0991d0222b4e1339c1a1a5b5f6d9f6a96672a3247b638ee6156d9ea877a2f1735e3a9260940e4c2225c344a8cea6c7b6a6057d0eb90a9a875f446c131031d")
    expect(derived1.getAddress().toString('hex')).toBe("6fac4d18c912343bf86fa7049364dd4e424ab9c0")
    const derived10 = mywallet.derive(10)
    expect(derived10.getPrivateKey().toString('hex')).toBe("1d8e676c6da57922d80336cffc5bf9020d0cce4730cff872aeb2dcce08320ce6")
    expect(derived10.getPublicKey().toString('hex')).toBe("a2075c4f558e4b1b4688b3e55eff56e84f574a3fe563db4fececd8cd978bfed13d35b9722e9b32c20a0189be73f6a8622299de0200de62b5e0f2f4ffbc7b17bd")
    expect(derived10.getAddress().toString('hex')).toBe("ef4ba16373841c53a9ba168873fc3967118c1d37")
  })
  // TODO: more here?
})

describe("Derive Tests Code 515 - DNA", () => {
  // Dna chain code slip44
  test("Derive mnemonic0 wallet", () => {
    const hdwallet = HDWallet.fromMnemonic("abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about")
    const mywallet = hdwallet.derive(`m/44'/515'/0'/0`)
    const derived0 = mywallet.derive(0)
    expect(derived0.getPrivateKey().toString('hex')).toBe("badefe6ef9ab76fcb6619065b1e162f10077fdaf20b1a825185fb2e407c3f60b")
    expect(derived0.getPublicKey().toString('hex')).toBe("f578b2b15c30598f059bba8151e5b3f82d86fd3f8f3a5b267d88395a845259d01636a5c70c59c8fce0d3c5387948767516390937bb50f1594741cf1f17ca5e73")
    expect(derived0.getAddress().toString('hex')).toBe("f4b397d5f2a5654975d668a5bde97415ae2401fd")
    const derived10 = mywallet.derive(10)
    expect(derived10.getPrivateKey().toString('hex')).toBe("18d146999329b17e348f5cb3814085b045ab161b85a4a640dff3cf8ed27e3cd1")
    expect(derived10.getPublicKey().toString('hex')).toBe("ed1b30c586ae7d8d956cd89844583336cb2fad5d91600ecf2d94dd6ca429affec908b0fd069afa282bc74e0a9b02d3d34e57ead499c6c3470f8821f30634b5e2")
    expect(derived10.getAddress().toString('hex')).toBe("1352155d8895516cca0416d77d741b31e9dc1634")
  })
  test("Derive mnemonic12 wallet", () => {
    const hdwallet = HDWallet.fromMnemonic("ozone drill grab fiber curtain grace pudding thank cruise elder eight picnic")
    const mywallet = hdwallet.derive(`m/44'/515'/0'/0`)
    const derived0 = mywallet.derive(0)
    expect(derived0.getPrivateKey().toString('hex')).toBe("c5a86dcd310b36edb729bddb0efb284a889b45573fa432a8c8815eaf4a4d5f7f")
    expect(derived0.getPublicKey().toString('hex')).toBe("2b6e223eab1ad3e65af8bf5720a8554e5afd14b43d9514a688f28fc33c3275e7e445ff4926ed3d94e4730adc410ada330c9c4775311f915bf9ff623b6efe5b5b")
    expect(derived0.getAddress().toString('hex')).toBe("1ed489b3a93094ea2ebe383bb344a5ee433da839")
    const derived10 = mywallet.derive(10)
    expect(derived10.getPrivateKey().toString('hex')).toBe("7adf1835200b00d99fe2cbb18d71151aef68425cbc4c2193e90aeeb24207efe6")
    expect(derived10.getPublicKey().toString('hex')).toBe("b1cd0c5287d1d1db1d5eef3c091dbbebb4a0185c939778e06629ab28dbd9e7e944c848ea7dc981b0c4aee4e260742573e2c7c523358a58f635884471b208d8bd")
    expect(derived10.getAddress().toString('hex')).toBe("b43d9d78c5b691348dd5632b97e670b51bf6704e")
  })
})
