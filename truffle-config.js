const HDWalletProvider = require('@truffle/hdwallet-provider');
const infuraKey = "eca89d4ba51a42fd99714e84f66b78fe";

const fs = require('fs');
const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    test: {
      host: "127.0.0.1",
      port: 7545,
      network_id: '*'
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`, 0, 2),
      network_id: 4,       // rinkeby's id
      gas: 4500000,        // rinkeby has a lower block limit than mainnet
      gasPrice: 10000000000
    }
  },
  moch: {},
  compilers: {
    solc: {
      version: "0.5.3",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        },
      }
    }
  }
};