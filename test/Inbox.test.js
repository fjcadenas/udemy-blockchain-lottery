import assert from "assert";
import ganache from "ganache-cli";
import Web3 from "web3"; // its a constructor
import inbox from "../compile";

const { abi, evm } = inbox;
const provider = ganache.provider();
const web3 = new Web3(provider);

const _INITIAL_MESSAGE = "Hi THere!";

describe("Inbox Contract", () => {
  let accounts;
  let inbox;
  beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();
    // Use any of the accounts to deploy de contract
    inbox = await new web3.eth.Contract(abi)
      .deploy({ data: evm.bytecode.object, arguments: [_INITIAL_MESSAGE] })
      .send({ from: accounts[0], gas: "1000000" });
    inbox.setProvider(provider);
  });
  it("it deploys a contract", () => {
    assert.ok(inbox.options.address);
  });

  it("has a default message", async () => {
    const message = await inbox.methods.message().call();
    assert.equal(_INITIAL_MESSAGE, message);
  });

  it("can change the message", async () => {
    const newMessage = "Hi There 2!";
    await inbox.methods.setMessage(newMessage).send({
      from: accounts[0],
    });
    const message = await inbox.methods.message().call();
    assert.equal(newMessage, message);
  });
});
