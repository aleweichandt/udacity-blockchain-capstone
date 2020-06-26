// migrating the appropriate contracts
var SquareVerifier = artifacts.require("./SquareVerifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

const proofs = require("../zokrates/proofs.json");

const tokenName = "Udacity AW Token";
const tokenSymbol = "UAWT";

module.exports = async function(deployer, network, accounts) {
  const owner = accounts[0];
  const tokenHolder = accounts[1];

  await deployer.deploy(SquareVerifier);
  await deployer.deploy(SolnSquareVerifier, SquareVerifier.address, tokenName, tokenSymbol);

  const instance = await SolnSquareVerifier.deployed();
  proofs.forEach(async (data, i) => {
    const { proof: { a, b, c, }, inputs } = data;
    await instance.mintToken(tokenHolder, i, a, b, c, inputs, { from: owner });
  })
};
