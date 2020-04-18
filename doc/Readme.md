# DnaMask

Hierarchical Deterministic wallet for Idena Crypto currency.

Full JS Version.


## Overview

- Generate any amount of keys from a single BIP39 mnemonic  
- Convert any seed into a BIP39 mnemonic (paperCode) and back.
- conforms to BIP44 
- Supports Idena robohashs

Auto build Github pages version: [https://angainordev.github.io/DnaMask/js/dist/index.html](https://angainordev.github.io/DnaMask/js/dist/index.html) 


## Derivation mechanism

BIP 39 - BIP44 - SLIP-0044

Coin type 515 was registered, PR:  
https://github.com/satoshilabs/slips/pull/913

You can use coin type 60 (eth) for tests but this is highly discouraged.  
A checkbox is available on the HD wallet generation page.

## Paper codes

Paper codes allow to regenerate individual wallets without the master word pass.

## Tests 

See test directory for API and sample use.

WIP

## Changelog

- v0.4: Display address index 0 - index was previously starting at 1.
- v0.3: Display bip39 mnemonic when creating a paperwallet from nodekey
- v0.2: Use 515 as coin type by default
- v0.1: Initial commit, fully functional

## Donation address

Donations will help us maintain and improve this tool and other ones

Idena Address
0x883657237b465dbfd9e246d9b9a8628c4977a41b  
![](https://github.com/AngainorDev/DnaMask/raw/master/angainor-pub.png)

