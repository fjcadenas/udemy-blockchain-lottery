import dotenv from "dotenv";
dotenv.config();

import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from "web3"; // its a constructor
import inbox from "./compile";

const { abi, evm } = inbox;

console.log(process.env.MNEMONIC);
const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  "https://rinkeby.infura.io/v3/455c93099a8b465a86a2b2e2261341e9"
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log(`Attempting to use account ${accounts[0]}`);

  const result = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object, arguments: ["Hi There!"] })
    .send({ gas: "1000000", from: accounts[0] });

  console.log(`Contract deployed to ${result.options.address}`);
  provider.engine.stop();
};

deploy();

/* Last execution:
  Attempting to use account 0x27da297C49dFb21AD74caCC34151B82Eae8Cb4d4
  Contract deployed to 0x889E7E7e103f15Fa63639B3AF9cd46e8294a448b
*/
